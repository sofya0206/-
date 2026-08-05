import { spawnSync } from "node:child_process";

const target = process.env.VERCEL === "1" || process.env.VERCEL_ENV
  ? "build:vercel"
  : "build:sites";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const result = spawnSync(npm, ["run", target], {
  stdio: "inherit",
  env: process.env,
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
