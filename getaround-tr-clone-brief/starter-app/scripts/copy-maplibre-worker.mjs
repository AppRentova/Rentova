import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = join(projectRoot, "node_modules", "maplibre-gl", "dist");
const targetRoot = join(projectRoot, "public", "maplibre");

await mkdir(targetRoot, { recursive: true });
await Promise.all([
  copyFile(join(sourceRoot, "maplibre-gl-worker.mjs"), join(targetRoot, "maplibre-gl-worker.mjs")),
  copyFile(join(sourceRoot, "maplibre-gl-shared.mjs"), join(targetRoot, "maplibre-gl-shared.mjs")),
]);
