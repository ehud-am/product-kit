import { mkdtemp, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  createEmptyManifest,
  loadManifest,
  MANIFEST_RELATIVE_PATH,
  saveManifest
} from "../../src/core/state/manifest.js";

const cleanupPaths: string[] = [];

afterEach(async () => {
  const { rm } = await import("node:fs/promises");
  await Promise.all(cleanupPaths.splice(0).map((target) => rm(target, { recursive: true, force: true })));
});

describe("manifest helpers", () => {
  it("writes and reads a manifest from the project-local .pmkit directory", async () => {
    const rootDir = await mkdtemp(path.join(os.tmpdir(), "pmkit-manifest-"));
    cleanupPaths.push(rootDir);

    const manifest = createEmptyManifest(rootDir, "0.1.0");
    manifest.targets.push({
      target: "claude",
      installed: true,
      assets: [],
      lastOperation: "add"
    });

    await saveManifest(rootDir, manifest);
    const loaded = await loadManifest(rootDir);

    expect(loaded?.pmkitVersion).toBe("0.1.0");
    expect(loaded?.targets[0]?.target).toBe("claude");

    const manifestPath = path.join(rootDir, MANIFEST_RELATIVE_PATH);
    expect(JSON.parse(await readFile(manifestPath, "utf8")).projectRoot).toBe(".");
  });
});
