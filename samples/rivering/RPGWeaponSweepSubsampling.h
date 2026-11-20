#pragma once

#include "Combat/RPGDirectionalSweep.h"
#include "Animation/AnimInstance.h"
#include "Animation/AnimMontage.h"
#include "BonePose.h"
#include "Components/SkeletalMeshComponent.h"
#include "Components/StaticMeshComponent.h"
#include "Debug/RPGCombatDebugDraw.h"
#include "HAL/IConsoleManager.h"
#include "MotionWarpingComponent.h"

namespace RPGWeaponSweepSubsampling
{
inline TAutoConsoleVariable<int32> Enabled(
    TEXT("rpg.Combat.Sweep.HitchSubsample"),
    0,
    TEXT("Resample the attack montage at 60 Hz when dedicated-server sweep samples are more than 50 ms apart. ")
    TEXT("Read when the hit window opens."),
    ECVF_Cheat);

static constexpr double SubsampleRateHz = 60.0;

struct FStep
{
    RPGWeaponSweep::Blade Blade;
    RPGDirectionalSweep::Trajectory Fit;
    double From = 0.0; // From/To in [0, 1].
    double To = 0.0;
};

namespace Private
{
inline FVector ToFVector(const RPGWeaponSweep::Vec& Value) { return FVector(Value.x, Value.y, Value.z); }
inline RPGWeaponSweep::Vec ToSweepVector(const FVector& Value) { return { Value.X, Value.Y, Value.Z }; }

inline const USceneComponent* FindSupportedAttachRoot(const USkeletalMeshComponent& OwnerMesh, const UStaticMeshComponent& WeaponMesh)
{
    const USceneComponent* Root = WeaponMesh.GetAttachParent();
    if (!Root || Root->GetAttachParent() != &OwnerMesh || !WeaponMesh.GetAttachSocketName().IsNone())
    {
        return nullptr;
    }

    auto UsesAbsolute = [](const USceneComponent& Component)
    {
        return Component.IsUsingAbsoluteLocation() || Component.IsUsingAbsoluteRotation() || Component.IsUsingAbsoluteScale();
    };
    if (UsesAbsolute(*Root) || UsesAbsolute(WeaponMesh))
    {
        return nullptr;
    }
    return Root;
}
}

inline void Prepare(TArray<FStep>& Steps, const UAnimMontage& Montage, USkeletalMeshComponent& OwnerMesh,
    const UStaticMeshComponent& WeaponMesh, const RPGWeaponSweep::Blade& Observed,
    RPGWeaponSweep::Vec PriorCutDir, double MontageStart, double MontageEnd, double DeltaSeconds)
{
    using namespace RPGWeaponSweep;

    if (MontageEnd <= MontageStart)
    {
        RPG_COMBAT_DEBUG_LOG(ERPGCombatDebugCategory::WeaponSweep, Verbose,
            TEXT("Skipping subsampling for %s: montage time %.4f -> %.4f"), *Montage.GetName(), MontageStart, MontageEnd);
        return;
    }
    // UE samples slot 0 only.
    if (Montage.SlotAnimTracks.Num() != 1)
    {
        RPG_COMBAT_DEBUG_LOG(ERPGCombatDebugCategory::WeaponSweep, Verbose,
            TEXT("Skipping subsampling for %s: expected one slot, found %d"), *Montage.GetName(), Montage.SlotAnimTracks.Num());
        return;
    }

    UAnimInstance* AnimInstance = OwnerMesh.GetAnimInstance();
    const USceneComponent* AttachRoot = Private::FindSupportedAttachRoot(OwnerMesh, WeaponMesh);
    if (!AnimInstance || !AttachRoot)
    {
        RPG_COMBAT_DEBUG_LOG(ERPGCombatDebugCategory::WeaponSweep, Verbose,
            TEXT("Skipping subsampling for %s: %s"), *WeaponMesh.GetName(),
            AnimInstance ? TEXT("unsupported weapon attachment") : TEXT("no animation instance"));
        return;
    }

    const FName MountBone = OwnerMesh.GetSocketBoneName(AttachRoot->GetAttachSocketName());
    const int32 MountBoneIndex = OwnerMesh.GetBoneIndex(MountBone);
    const FBoneContainer& RequiredBones = AnimInstance->GetRequiredBones();
    if (MountBoneIndex == INDEX_NONE || !RequiredBones.IsValid())
    {
        RPG_COMBAT_DEBUG_LOG(ERPGCombatDebugCategory::WeaponSweep, Verbose,
            TEXT("Skipping subsampling for %s: %s"), *MountBone.ToString(),
            MountBoneIndex == INDEX_NONE ? TEXT("mount bone not found") : TEXT("required bones unavailable"));
        return;
    }

    const FCompactPoseBoneIndex MountCompactIndex = RequiredBones.MakeCompactPoseIndex(FMeshPoseBoneIndex(MountBoneIndex));
    if (!MountCompactIndex.IsValid())
    {
        RPG_COMBAT_DEBUG_LOG(ERPGCombatDebugCategory::WeaponSweep, Verbose,
            TEXT("Skipping subsampling: %s is missing from the current pose"), *MountBone.ToString());
        return;
    }

    const FTransform WeaponToBone = WeaponMesh.GetComponentTransform().GetRelativeTransform(OwnerMesh.GetBoneTransform(MountBoneIndex));
    const FTransform MeshToWorld = OwnerMesh.GetComponentTransform();
    const FVector BaseInWeaponSpace = WeaponMesh.GetComponentTransform().InverseTransformPosition(Private::ToFVector(Observed.base1));

    auto SampleWeaponPose = [&](double MontageTime) -> Pose
    {
        FMemMark Mark(FMemStack::Get());
        FCSPose<FCompactPose> ComponentPose;
        UMotionWarpingUtilities::ExtractComponentSpacePose(&Montage, RequiredBones, MontageTime, /*bExtractRootMotion*/ false, ComponentPose);

        const FTransform WeaponToWorld = WeaponToBone * ComponentPose.GetComponentSpaceTransform(MountCompactIndex) * MeshToWorld;
        const FQuat Rotation = WeaponToWorld.GetRotation().GetNormalized();
        return { Private::ToSweepVector(WeaponToWorld.TransformPosition(BaseInWeaponSpace)), { Rotation.W, Rotation.X, Rotation.Y, Rotation.Z } };
    };

    // Match the recorded weapon pose at both ends.
    const Pose MontageAtStart = SampleWeaponPose(MontageStart);
    const Pose MontageAtEnd = SampleWeaponPose(MontageEnd);
    const Pose StartError{ Observed.base0 - MontageAtStart.p, Observed.rotation0 * MontageAtStart.q.Inverse() };
    const Pose EndError{ Observed.base1 - MontageAtEnd.p, Observed.rotation1 * MontageAtEnd.q.Inverse() };

    const Vec AxisInWeapon = Observed.rotation0.Inverse().Rotate(Observed.axis0);
    const Vec CutDirInWeapon = Observed.rotation0.Inverse().Rotate(PriorCutDir);

    const int32 NumSteps = FMath::CeilToInt(DeltaSeconds * SubsampleRateHz);
    Steps.Reserve(NumSteps);

    Pose StepStart{ Observed.base0, Observed.rotation0 };
    for (int32 Step = 1; Step <= NumSteps; ++Step)
    {
        const bool bFirst = (Step == 1);
        const bool bLast = (Step == NumSteps);
        const double Alpha = double(Step) / NumSteps;

        Pose StepEnd{ Observed.base1, Observed.rotation1 };
        if (!bLast)
        {
            const Pose Authored = SampleWeaponPose(FMath::Lerp(MontageStart, MontageEnd, Alpha));
            const Pose Correction = Interpolate(StartError, EndError, Alpha);
            StepEnd = { Authored.p + Correction.p, Correction.q * Authored.q };
        }

        Blade SubBlade = Observed;
        SubBlade.base0 = StepStart.p;
        SubBlade.base1 = StepEnd.p;
        SubBlade.rotation0 = StepStart.q;
        SubBlade.rotation1 = StepEnd.q;
        SubBlade.axis0 = bFirst ? Observed.axis0 : StepStart.q.Rotate(AxisInWeapon);
        SubBlade.axis1 = bLast ? Observed.axis1 : StepEnd.q.Rotate(AxisInWeapon);

        const auto Trajectory = RPGDirectionalSweep::Fit(SubBlade, StepStart.q.Rotate(CutDirInWeapon));
        if (!Trajectory.valid)
        {
            // Empty selects the full-interval sweep.
            RPG_COMBAT_DEBUG_LOG(ERPGCombatDebugCategory::WeaponSweep, Verbose,
                TEXT("Discarding substeps for %s: fit %d/%d failed (%s)"),
                *Montage.GetName(), Step, NumSteps, UTF8_TO_TCHAR(Trajectory.reason));
            Steps.Reset();
            return;
        }

        Steps.Add({ SubBlade, Trajectory, double(Step - 1) / NumSteps, Alpha });
        StepStart = StepEnd;
    }
}

// Adjacent intervals share the recorded endpoints.
inline void InterpolateBodies(std::vector<RPGWeaponSweep::Body>& Result,
    const std::vector<RPGWeaponSweep::Body>& Source, double From, double To)
{
    Result = Source;
    for (size_t Index = 0; Index < Source.size(); ++Index)
    {
        const auto& Recorded = Source[Index];
        auto& Sampled = Result[Index];

        if (From > 0.0)
        {
            Sampled.previous = Interpolate(Recorded.previous, Recorded.current, From);
            Sampled.bonePrevious = Interpolate(Recorded.bonePrevious, Recorded.boneCurrent, From);
        }
        if (To < 1.0)
        {
            Sampled.current = Interpolate(Recorded.previous, Recorded.current, To);
            Sampled.boneCurrent = Interpolate(Recorded.bonePrevious, Recorded.boneCurrent, To);
        }
    }
}
}
