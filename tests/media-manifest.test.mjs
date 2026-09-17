import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

test("drop-in media discovers formats, prefers video, chooses posters and preserves missing slots", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-media-"));
  try {
    fs.mkdirSync(path.join(root, "src/data"), { recursive: true });
    fs.mkdirSync(path.join(root, "public/media/rivering"), { recursive: true });
    fs.writeFileSync(
      path.join(root, "src/data/media-slots.json"),
      JSON.stringify({
        rivering: {
          hero: { title: "Hero" },
          empty: { title: "Empty" },
          animated: { title: "GIF" },
        },
      }),
    );
    for (const name of [
      "hero.mp4",
      "hero.webm",
      "hero.webp",
      "hero-poster.png",
      "animated.gif",
      "empty.mov",
    ])
      fs.writeFileSync(
        path.join(root, "public/media/rivering", name),
        "fixture",
      );
    const run = spawnSync(
      process.execPath,
      [path.resolve("scripts/sync-media.mjs")],
      { cwd: root, encoding: "utf8" },
    );
    assert.equal(run.status, 0, run.stderr);
    const data = JSON.parse(
      fs.readFileSync(path.join(root, "src/data/media.generated.json"), "utf8"),
    );
    assert.deepEqual(
      data["rivering/hero"].sources.map((s) => s.mime),
      ["video/mp4", "video/webm", "image/webp"],
    );
    assert.equal(
      data["rivering/hero"].poster,
      "/media/rivering/hero-poster.png",
    );
    assert.deepEqual(data["rivering/empty"].sources, []);
    assert.equal(data["rivering/animated"].sources[0].type, "gif");
    fs.unlinkSync(path.join(root, "public/media/rivering/hero-poster.png"));
    const next = spawnSync(
      process.execPath,
      [path.resolve("scripts/sync-media.mjs")],
      { cwd: root, encoding: "utf8" },
    );
    assert.equal(next.status, 0, next.stderr);
    assert.equal(
      JSON.parse(
        fs.readFileSync(
          path.join(root, "src/data/media.generated.json"),
          "utf8",
        ),
      )["rivering/hero"].poster,
      "/media/rivering/hero.webp",
    );
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
