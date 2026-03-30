import path from "node:path";
import { rename } from "node:fs/promises";
import type { AssetRecord, ManagedManifest, OperationFileResult } from "../../types/index.js";
import {
  LEGACY_PRODUCT_DOCS_DIR,
  LEGACY_PRODUCT_TEMPLATES_DIR,
  PRODUCT_DOCS_DIR,
  sharedAssetRegistry
} from "../assets/registry.js";
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
  notes: string[];
}

export async function installSharedAssets(
  rootDir: string,
  packageRoot: string
): Promise<SharedAssetInstallResult> {
  const migration = await migrateLegacyProductDirectory(rootDir);
  const sharedAssets: AssetRecord[] = [];
  const files: OperationFileResult[] = [];

  for (const asset of sharedAssetRegistry) {
    const sourcePath = joinProjectPath(packageRoot, asset.sourcePath);
    const targetPath = joinProjectPath(rootDir, asset.targetPath);
    assertInsideRoot(rootDir, targetPath);

    const existed = await pathExists(targetPath);
    await ensureDirectory(path.dirname(targetPath));
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

  return {
    sharedAssets,
    files: [...migration.files, ...files],
    notes: migration.notes
  };
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

interface ProductDirectoryMigrationResult {
  files: OperationFileResult[];
  notes: string[];
}

export async function migrateLegacyProductDirectory(rootDir: string): Promise<ProductDirectoryMigrationResult> {
  const legacyDir = joinProjectPath(rootDir, LEGACY_PRODUCT_DOCS_DIR);
  const productDir = joinProjectPath(rootDir, PRODUCT_DOCS_DIR);

  if (!(await pathExists(legacyDir))) {
    return { files: [], notes: [] };
  }

  if (await pathExists(productDir)) {
    const legacyTemplatesDir = joinProjectPath(rootDir, LEGACY_PRODUCT_TEMPLATES_DIR);
    return {
      files: [],
      notes: [
        await pathExists(legacyTemplatesDir)
          ? "Legacy /.product content still exists alongside /product. Existing /product content was left untouched; review and merge any remaining files manually."
          : "Legacy /.product content still exists alongside /product. Existing /product content was left untouched."
      ]
    };
  }

  await ensureDirectory(path.dirname(productDir));
  await rename(legacyDir, productDir);

  return {
    files: [
      {
        path: LEGACY_PRODUCT_DOCS_DIR,
        action: "removed"
      },
      {
        path: PRODUCT_DOCS_DIR,
        action: "created"
      }
    ],
    notes: ["Migrated legacy /.product content to /product."]
  };
}
