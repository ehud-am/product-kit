import path from "node:path";
import type {
  AssetRecord,
  AssistantTarget,
  ManagedManifest,
  ManagedTargetState,
  OperationFileResult,
  OperationSummary,
  RequestedTarget
} from "../../types/index.js";
import { getTargetAssetDefinitions } from "../assets/registry.js";
import {
  assertInsideRoot,
  ensureDirectory,
  hashFile,
  joinProjectPath,
  pathExists,
  readText,
  writeText
} from "../fs/project.js";
import {
  createEmptyManifest,
  loadManifest,
  saveManifest,
  setSharedAssets,
  upsertTargetState
} from "../state/manifest.js";
import { resolveTargets } from "./targets.js";
import { installSharedAssets } from "./shared-assets.js";

export interface AddOptions {
  rootDir: string;
  packageRoot: string;
  requestedTarget: RequestedTarget;
  productSpecVersion: string;
}

function buildTargetState(target: AssistantTarget, assets: AssetRecord[]): ManagedTargetState {
  return {
    target,
    installed: true,
    assets,
    lastOperation: "add"
  };
}

export async function runAdd(options: AddOptions): Promise<OperationSummary> {
  const selectedTargets = resolveTargets(options.requestedTarget);
  let manifest = (await loadManifest(options.rootDir)) ?? createEmptyManifest(options.rootDir, options.productSpecVersion);
  manifest.productSpecVersion = options.productSpecVersion;

  const files: OperationFileResult[] = [];
  const changedTargets: AssistantTarget[] = [];
  const skippedTargets: AssistantTarget[] = [];

  for (const target of selectedTargets) {
    const assetDefinitions = getTargetAssetDefinitions(target);
    const managedAssets: AssetRecord[] = [];

    for (const asset of assetDefinitions) {
      const sourcePath = joinProjectPath(options.packageRoot, asset.sourcePath);
      const targetPath = joinProjectPath(options.rootDir, asset.targetPath);
      assertInsideRoot(options.rootDir, targetPath);

      await ensureDirectory(path.dirname(targetPath));
      const existed = await pathExists(targetPath);
      await writeText(targetPath, await readText(sourcePath));

      managedAssets.push({
        ...asset,
        checksum: await hashFile(targetPath),
        managed: true
      });
      files.push({
        path: asset.targetPath,
        action: existed ? "updated" : "created"
      });
    }

    const alreadyManaged = manifest.targets.some((entry) => entry.target === target && entry.installed);
    manifest = upsertTargetState(manifest, buildTargetState(target, managedAssets));
    if (alreadyManaged) {
      skippedTargets.push(target);
    } else {
      changedTargets.push(target);
    }
  }

  const sharedInstall = await installSharedAssets(options.rootDir, options.packageRoot);
  manifest = setSharedAssets(manifest, sharedInstall.sharedAssets);
  files.push(...sharedInstall.files);

  await saveManifest(options.rootDir, manifest);

  return {
    requestedTarget: options.requestedTarget,
    changedTargets,
    skippedTargets,
    files,
    notes: [
      ...sharedInstall.notes,
      "Run `product-spec check` to validate the installed integrations.",
      "Installed workflow: domain -> press -> faq -> narrative -> roadmap -> speckit* -> align -> current-truth under `docs/product/`."
    ]
  };
}
