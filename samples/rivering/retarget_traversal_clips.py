"""Batch-retarget animation clips with an existing IK Retargeter.

Run from the editor's Python console:
    recs = retarget_clips(paths, src_mesh, dst_mesh, rtg, "/Game/Anims/Retargeted")
"""

import unreal

EAL = unreal.EditorAssetLibrary
BATCH_SIZE = 24  # Batch size from Rivering's 381-clip traversal pass.


def _plan_outputs(source_paths, folder):
    """Map output path -> source path. Blows up on name clashes."""
    outputs = {}
    for path in source_paths:
        asset = EAL.find_asset_data(path)
        if not asset.is_valid():
            raise ValueError(f"Source asset not found: {path}")
        src = str(asset.package_name)
        dst = f"{folder}/{asset.asset_name}"
        if dst == src or dst in outputs:
            raise ValueError(f"Output path conflict: {src} -> {dst}")
        outputs[dst] = src
    return outputs


def _run_batch(batch, source_mesh, target_mesh, retargeter, folder, task):
    inputs = unreal.IKRetargetBatchOperationInputs()
    inputs.source_mesh = source_mesh
    inputs.target_mesh = target_mesh
    inputs.ik_retarget_asset = retargeter
    inputs.target_path = folder
    inputs.assets_to_retarget = [EAL.find_asset_data(p) for p in batch]
    inputs.include_referenced_assets = False
    inputs.overwrite_existing_files = False

    created = unreal.IKRetargetBatchOperation.run_batch_retarget(inputs)
    # UE 5.8.4 can return entries for clips the native retargeter just removed on cancel.
    if task.should_cancel():
        raise InterruptedError("Retarget cancelled. Use resume=True to continue.")
    if len(created) != len(batch):
        raise RuntimeError(f"Retargeter returned {len(created)}/{len(batch)} clips "
                           f"(first in batch: {batch[0]})")

    for asset_data in created:
        clip = asset_data.get_asset()
        if not clip or not EAL.save_loaded_asset(clip, only_if_is_dirty=False):
            raise RuntimeError(f"Failed to save {asset_data.asset_name}")


def _root_delta_cm(clip):
    """Root translation from first to last frame."""
    get_pose = unreal.AnimationLibrary.get_bone_pose_for_time
    first = get_pose(clip, "root", 0.0, False)
    last = get_pose(clip, "root", clip.get_play_length(), False)
    d = last.translation - first.translation
    return [d.x, d.y, d.z]


def retarget_clips(source_paths, source_mesh, target_mesh, retargeter,
                   output_folder, resume=False):
    folder = output_folder.rstrip("/")
    outputs = _plan_outputs(source_paths, folder)

    todo = []
    for dst, src in outputs.items():
        if not EAL.does_asset_exist(dst):
            todo.append(src)
        elif not resume:
            raise FileExistsError(f"{dst} already exists (use resume=True to skip it)")

    batches = [todo[i:i + BATCH_SIZE] for i in range(0, len(todo), BATCH_SIZE)]
    with unreal.ScopedSlowTask(len(batches), "Retargeting animations") as task:
        task.make_dialog(True)
        for batch in batches:
            task.enter_progress_frame(1)
            if task.should_cancel():
                raise InterruptedError("Retarget cancelled. Use resume=True to continue.")
            _run_batch(batch, source_mesh, target_mesh, retargeter, folder, task)

    skeleton = target_mesh.get_editor_property("skeleton")
    records = []
    for dst, src in outputs.items():
        # A resumed run also needs to check clips already on disk.
        clip = unreal.load_asset(dst)
        if not isinstance(clip, unreal.AnimSequence):
            raise RuntimeError(f"{dst} is missing or not an AnimSequence")
        if clip.get_editor_property("skeleton") != skeleton:
            raise ValueError(f"{dst} is on the wrong skeleton")
        records.append({
            "source": src,
            "target": dst,
            "duration_s": clip.get_play_length(),
            "root_delta_cm": _root_delta_cm(clip),
        })

    unreal.log(f"Retargeted {len(todo)} new clips, {len(records)} total in {folder}")
    return records
