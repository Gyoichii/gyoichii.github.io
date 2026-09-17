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

| Exact preferred path                           | What to show                                                                                                                              |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `public/media/rivering/hero.mp4`               | 15–30 second overview: movement, one combat exchange, environment. Replaces the current building-variant cover on home and project hero. |
| `public/media/rivering/skill-vfx.mp4`          | Current skill such as Spin 360, trail timing and impact feedback.                                                                         |
| `public/media/rivering/gasp-block.mp4`         | Block entry, walking/turning while blocking, exit.                                                                                        |
| `public/media/rivering/melee-sweep.mp4`        | Accepted contacts and sweep debug geometry after the newest changes pass in-game acceptance.                                              |
| `public/media/rivering/pcg-graph.webp`         | Legible PCG graph/debug layout without private desktop/account information.                                                               |

Already populated from the supplied Unreal captures:

- `combat-interaction.mp4`: combat demo trimmed to source 8.00–44.40 s.
- `cr-facing.mp4`: vertical-aim demonstration trimmed to source 0.65–19.20 s.
- `occlusion-walkthrough.mp4`: building visibility demonstration trimmed to source 0.45–14.10 s; the earlier GIF remains separately available.
- `material-sphere.mp4`: complete material-instance demonstration, including the final 90-degree rotation adjustment. No temporal cut or video re-encoding.
- `glass-transmission.webp`, `glass-variants.webp`, `wall-weathering.webp`, `material-instance-controls.webp`: supplied material screenshots.

- `pcg-urban-village.mp4`: building-height changes, with a static poster.
- `pcg-dimensions.gif`: complete building-size adjustment recording, with a static poster.
- `occlusion.gif`: complete in-game building/stairwell walkthrough, with a static poster.
- `pcg-variants.webp`: three generated buildings; also used on the homepage and project cover.

`building-study.webp` and `module-kit.webp` remain labelled Blender asset previews. Update captions if replacing them with in-engine images.

## Friday Night

The page now contains six redacted application screenshots:

| File under `public/media/friday-night/` | Content                                                  |
| --------------------------------------- | -------------------------------------------------------- |
| `group-workflow.webp`                   | Shared movie list; homepage card and project hero.       |
| `movie-detail.webp`                     | Ratings, votes, watched/archive actions, and discussion. |
| `notifications.webp`                    | Notification preferences and activity items.             |
| `group-settings.webp`                   | Join approval, visibility, and member roles.             |
| `group-selection.webp`                  | Group switching, creation, and joining.                  |
| `movie-search.webp`                     | TMDB search and movie import.                            |

`desktop.webp` and `mobile.webp` retain the earlier public login captures in the security section.

Optional: add `group-workflow.mp4` to replace the hero still with a walkthrough. Keep the WebP as its poster. Use demo data or redact invite codes, account names, group identifiers, and private text before publishing replacement media. Original unredacted screenshots are not included in the repository.

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
