import type { AssetRecord, ManagedManifest, OperationFileResult } from "../../types/index.js";
import { sharedAssetRegistry } from "../assets/registry.js";
import {
  assertInsideRoot,
  ensureDirectory,
  hashFile,
  joinProjectPath,
  pathExists,
  readText,
  removeIfExists,
  writeText
} from "../fs/project.js";

interface SharedAssetInstallResult {
  sharedAssets: AssetRecord[];
  files: OperationFileResult[];
}

export async function installSharedAssets(
  rootDir: string,
  packageRoot: string
): Promise<SharedAssetInstallResult> {
  const sharedAssets: AssetRecord[] = [];
  const files: OperationFileResult[] = [];

  for (const asset of sharedAssetRegistry) {
    const sourcePath = joinProjectPath(packageRoot, asset.sourcePath);
    const targetPath = joinProjectPath(rootDir, asset.targetPath);
    assertInsideRoot(rootDir, targetPath);

    const existed = await pathExists(targetPath);
    await ensureDirectory(joinProjectPath(rootDir, ".product/templates"));
    await writeText(targetPath, await readText(sourcePath));

    sharedAssets.push({
      ...asset,
      checksum: await hashFile(targetPath),
      managed: true
    });
    files.push({
      path: asset.targetPath,
      action: existed ? "updated" : "created"
    });
  }

  return { sharedAssets, files };
}

export async function removeSharedAssets(
  rootDir: string,
  manifest: ManagedManifest
): Promise<OperationFileResult[]> {
  const files: OperationFileResult[] = [];

  for (const asset of manifest.sharedAssets) {
    const targetPath = joinProjectPath(rootDir, asset.targetPath);
    assertInsideRoot(rootDir, targetPath);
    const removed = await removeIfExists(targetPath);
    files.push({
      path: asset.targetPath,
      action: removed ? "removed" : "skipped"
    });
  }

  return files;
}
