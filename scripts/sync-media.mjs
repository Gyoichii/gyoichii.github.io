import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const slots = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/media-slots.json"), "utf8"),
);
const result = {};
const extensions = ["mp4", "webm", "webp", "jpg", "jpeg", "png", "gif"];
for (const [project, items] of Object.entries(slots)) {
  const directory = path.join(root, "public/media", project);
  fs.mkdirSync(directory, { recursive: true });
  for (const [slot, info] of Object.entries(items)) {
    const sources = extensions
      .filter((ext) => fs.existsSync(path.join(directory, `${slot}.${ext}`)))
      .map((ext) => ({
        src: `/media/${project}/${slot}.${ext}`,
        type:
          ext === "mp4" || ext === "webm"
            ? "video"
            : ext === "gif"
              ? "gif"
              : "image",
        mime:
          ext === "mp4"
            ? "video/mp4"
            : ext === "webm"
              ? "video/webm"
              : `image/${ext === "jpg" ? "jpeg" : ext}`,
      }));
    const posterExt = ["webp", "jpg", "png"].find((ext) =>
      fs.existsSync(path.join(directory, `${slot}-poster.${ext}`)),
    );
    result[`${project}/${slot}`] = {
      id: `${project}/${slot}`,
      ...info,
      project,
      sources,
      poster: posterExt
        ? `/media/${project}/${slot}-poster.${posterExt}`
        : sources.find((s) => s.type === "image")?.src,
    };
  }
}
fs.writeFileSync(
  path.join(root, "src/data/media.generated.json"),
  JSON.stringify(result, null, 2) + "\n",
);
console.log(
  `Media manifest: ${Object.values(result).filter((m) => m.sources.length).length}/${Object.keys(result).length} slots populated.`,
);
