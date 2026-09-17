import { spawnSync } from "node:child_process";
const command = process.argv[2] || "dev";
if (command === "typecheck") {
  const generated = spawnSync(
    process.execPath,
    ["node_modules/next/dist/bin/next", "typegen"],
    { stdio: "inherit", env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" } },
  );
  if (generated.status !== 0) process.exit(generated.status ?? 1);
}
if (command === "dev" || command === "build") {
  const sync = spawnSync(process.execPath, ["scripts/sync-media.mjs"], {
    stdio: "inherit",
  });
  if (sync.status !== 0) process.exit(sync.status ?? 1);
}
const tool =
  command === "typecheck"
    ? "typescript/bin/tsc"
    : command === "lint"
      ? "eslint/bin/eslint.js"
      : "next/dist/bin/next";
const args =
  command === "typecheck"
    ? ["--noEmit"]
    : command === "lint"
      ? ["app", "src", "scripts", "tests"]
      : [
          command,
          ...(command === "build" ? ["--webpack"] : []),
          ...process.argv.slice(3),
        ];
const result = spawnSync(process.execPath, [`node_modules/${tool}`, ...args], {
  stdio: "inherit",
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
});
process.exit(result.status ?? 1);
