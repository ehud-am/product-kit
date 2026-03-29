import path from "node:path";
import type { AssistantTarget, OperationFileResult, OperationSummary, RequestedTarget } from "../../types/index.js";
import {
  joinProjectPath,
  removeEmptyDirectoryIfExists,
  removeIfExists
} from "../fs/project.js";
import {
  loadManifest,
  manifestHasInstalledTargets,
  manifestPath,
  removeManifest,
  saveManifest
} from "../state/manifest.js";
import { resolveTargets } from "./targets.js";
import { removeSharedAssets } from "./shared-assets.js";

export interface RemoveOptions {
  rootDir: string;
  requestedTarget: RequestedTarget;
}

export async function runRemove(options: RemoveOptions): Promise<OperationSummary> {
  const selectedTargets = resolveTargets(options.requestedTarget);
  const manifest = await loadManifest(options.rootDir);
  const files: OperationFileResult[] = [];
  const changedTargets: AssistantTarget[] = [];
  const skippedTargets: AssistantTarget[] = [];

  if (!manifest) {
    return {
      requestedTarget: options.requestedTarget,
      changedTargets,
      skippedTargets: selectedTargets,
      files,
      notes: ["No manifest found. Nothing to remove."]
    };
  }

  for (const target of selectedTargets) {
    const existing = manifest.targets.find((entry) => entry.target === target);
    if (!existing) {
      skippedTargets.push(target);
      continue;
    }

    changedTargets.push(target);

    for (const asset of existing.assets) {
      const targetPath = joinProjectPath(options.rootDir, asset.targetPath);
      const removed = await removeIfExists(targetPath);
      files.push({
        path: asset.targetPath,
        action: removed ? "removed" : "skipped"
      });
      await removeEmptyDirectoryIfExists(path.dirname(targetPath));
    }
  }

  manifest.targets = manifest.targets.filter((entry) => !selectedTargets.includes(entry.target));
  const remainingTargets = manifest.targets.filter((entry) => entry.installed);
  if (remainingTargets.length === 0) {
    files.push(...(await removeSharedAssets(options.rootDir, manifest)));
    manifest.sharedAssets = [];
  }

  if (manifestHasInstalledTargets(manifest) || manifest.sharedAssets.length > 0) {
    manifest.updatedAt = new Date().toISOString();
    await saveManifest(options.rootDir, manifest);
  } else {
    await removeManifest(options.rootDir);
    await removeEmptyDirectoryIfExists(path.dirname(manifestPath(options.rootDir)));
  }

  return {
    requestedTarget: options.requestedTarget,
    changedTargets,
    skippedTargets: Array.from(new Set(skippedTargets.filter((target) => !changedTargets.includes(target)))),
    files,
    notes: []
  };
}
