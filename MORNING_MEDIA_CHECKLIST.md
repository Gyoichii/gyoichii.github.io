# Morning media checklist

Live portfolio: https://gyoichii.github.io/

## Fastest path

1. Copy a file into `public/media/<project>/` with a basename below.
2. Use MP4, WebM, GIF, WebP, JPG/JPEG or PNG. No component edits needed.
3. Run `npm run build`; preview with `npm start` at http://127.0.0.1:4173.
4. Review, commit intended files and push `main`. GitHub Actions publishes the update.

Edit captions in `src/data/media-slots.json`. Never edit `media.generated.json` manually. `npm run media:sync` refreshes it separately.

## Rivering: first priority

Use current working captures. Prefer compressed 1080p H.264 MP4, about 10–20 seconds per study. GitHub rejects individual files above 100 MB. Previews are muted; sound is available in the expanded viewer.

| Exact preferred path                           | What to show                                                                                                                   |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `public/media/rivering/hero.mp4`               | 15–30 second overview: movement, one combat exchange, environment. Replaces the asset-study fallback on home and project hero. |
| `public/media/rivering/combat-interaction.mp4` | Attack → block → dash/targeting, with readable state changes.                                                                  |
| `public/media/rivering/skill-vfx.mp4`          | Current skill such as Spin 360, trail timing and impact feedback.                                                              |
| `public/media/rivering/gasp-block.mp4`         | Block entry, walking/turning while blocking, exit.                                                                             |
| `public/media/rivering/melee-sweep.mp4`        | Accepted contacts and sweep debug geometry after the newest changes pass in-game acceptance.                                   |
| `public/media/rivering/cr-facing.mp4`          | Facing across action states; optional Control Rotation and actor/root yaw overlay.                                             |
| `public/media/rivering/material-sphere.mp4`    | Controlled material turntable: wall blend and aged-glass controls.                                                             |
| `public/media/rivering/occlusion.mp4`          | Walk behind wall/roof, visibility window and retained collision.                                                               |
| `public/media/rivering/pcg-urban-village.mp4`  | Change building parameters/seed, regenerate, orbit or walk through result.                                                     |
| `public/media/rivering/pcg-variants.webp`      | Clearly different building variants under comparable lighting.                                                                 |
| `public/media/rivering/pcg-graph.webp`         | Legible PCG graph/debug layout without private desktop/account information.                                                    |

Already populated: `building-study.webp` and `module-kit.webp`, labelled Blender asset previews. Update captions if replacing them with in-engine images.

## Friday Night

Already populated: `public/media/friday-night/desktop.webp` and `mobile.webp`, real public login captures.

Missing: `public/media/friday-night/group-workflow.mp4`. Use a demo group with fictional names; show joining, adding a film, voting and roles. Keep private comments, cookies and invitation codes out of the recording. To replace the sign-in hero with a safe product view, overwrite `desktop.webp` and revise its caption.

## WayJia

Already populated: `public/media/wayjia/hero.webp`, `exploration.webp` and `credits.webp`, from the final-game press kit.

Missing: `public/media/wayjia/gameplay.mp4`. Show thrust/inertia, radar/resonance, a region transition and a narrative moment. Preserve collaborator attribution.

## Posters and formats

For `combat-interaction.mp4`, add `combat-interaction-poster.webp` (or JPG/PNG). A same-basename still `combat-interaction.webp` also works as poster. Explicit `-poster` wins.

Selection order: MP4 → WebM → WebP → JPG → JPEG → PNG → GIF. MP4/WebM can coexist as browser alternatives. Remove an older higher-priority file if intending a different format to become primary. Names must be lowercase and are case-sensitive on the host.

Reduced-motion users receive paused video. Add a static `-poster` for GIF; otherwise it shows an intentional paused placeholder and can be explicitly opened. Missing slots never generate broken image URLs.

## Before sharing

- `npm run verify` and `npm run build` pass.
- Check public home and all three project pages after Actions completes.
- Open a film, test sound, Escape and keyboard navigation.
- Check phone layout, resume PDF, GitHub and email links.
- Revise captions and status text that no longer describe the new media.
