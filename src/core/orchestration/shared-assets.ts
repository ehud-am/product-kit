import path from "node:path";
import { rename } from "node:fs/promises";
import type { AssetRecord, ManagedManifest, OperationFileResult } from "../../types/index.js";
import {
  LEGACY_PRODUCT_DOCS_DIR,
  LEGACY_PRODUCT_TEMPLATES_DIR,
  PREVIOUS_PRODUCT_DOCS_DIR,
  PREVIOUS_PRODUCT_TEMPLATES_DIR,
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

async function reportConflict(
  rootDir: string,
  sources: string[]
): Promise<ProductDirectoryMigrationResult> {
  const sourceList = sources.map((source) => `/${source}`).join(" and ");
  const templateSources = await Promise.all(
    [
      LEGACY_PRODUCT_TEMPLATES_DIR,
      PREVIOUS_PRODUCT_TEMPLATES_DIR
    ]
      .filter((templateDir) => sources.some((source) => templateDir.startsWith(source)))
      .map(async (templateDir) => ((await pathExists(joinProjectPath(rootDir, templateDir))) ? `/${templateDir}` : null))
  );
  const existingTemplateSources = templateSources.filter((value): value is string => value !== null);

  return {
    files: [],
    notes: [
      existingTemplateSources.length > 0
        ? `Legacy product docs still exist in ${sourceList} alongside /${PRODUCT_DOCS_DIR}. Existing /${PRODUCT_DOCS_DIR} content was left untouched; review and merge any remaining files manually, including templates in ${existingTemplateSources.join(" and ")}.`
        : `Legacy product docs still exist in ${sourceList} alongside /${PRODUCT_DOCS_DIR}. Existing /${PRODUCT_DOCS_DIR} content was left untouched; review and merge any remaining files manually.`
    ]
  };
}

export async function migrateLegacyProductDirectory(rootDir: string): Promise<ProductDirectoryMigrationResult> {
  const legacyDir = joinProjectPath(rootDir, LEGACY_PRODUCT_DOCS_DIR);
  const previousDir = joinProjectPath(rootDir, PREVIOUS_PRODUCT_DOCS_DIR);
  const productDir = joinProjectPath(rootDir, PRODUCT_DOCS_DIR);
  const hasLegacyDir = await pathExists(legacyDir);
  const hasPreviousDir = await pathExists(previousDir);
  const hasCanonicalDir = await pathExists(productDir);

  if (!hasLegacyDir && !hasPreviousDir) {
    return { files: [], notes: [] };
  }

  if (hasCanonicalDir) {
    const sources = [hasPreviousDir ? PREVIOUS_PRODUCT_DOCS_DIR : null, hasLegacyDir ? LEGACY_PRODUCT_DOCS_DIR : null].filter(
      (value): value is string => value !== null
    );
    return reportConflict(rootDir, sources);
  }

  if (hasLegacyDir && hasPreviousDir) {
    return {
      files: [],
      notes: [
        `Legacy product docs exist in /${LEGACY_PRODUCT_DOCS_DIR} and /${PREVIOUS_PRODUCT_DOCS_DIR}. product-spec now writes docs to /${PRODUCT_DOCS_DIR}; review and merge these directories manually before rerunning \`product-spec add\`.`
      ]
    };
  }

  await ensureDirectory(path.dirname(productDir));
  if (hasPreviousDir) {
    await rename(previousDir, productDir);

    return {
      files: [
        {
          path: PREVIOUS_PRODUCT_DOCS_DIR,
          action: "removed"
        },
        {
          path: PRODUCT_DOCS_DIR,
          action: "created"
        }
      ],
      notes: [`Migrated legacy /${PREVIOUS_PRODUCT_DOCS_DIR} content to /${PRODUCT_DOCS_DIR}.`]
    };
  }

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
    notes: [`Migrated legacy /${LEGACY_PRODUCT_DOCS_DIR} content to /${PRODUCT_DOCS_DIR}.`]
  };
}
