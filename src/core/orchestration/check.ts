import type { AssistantTarget, HealthIssue, HealthReport, RequestedTarget } from "../../types/index.js";
import {
  LEGACY_PRODUCT_DOCS_DIR,
  LEGACY_PRODUCT_TEMPLATES_DIR,
  PRODUCT_DOCS_DIR,
  PRODUCT_TEMPLATES_DIR,
  getTargetAssetDefinitions,
  sharedAssetRegistry
} from "../assets/registry.js";
import { joinProjectPath, pathExists } from "../fs/project.js";
import { loadManifest } from "../state/manifest.js";
import { getAdapter, resolveTargets } from "./targets.js";

export interface CheckOptions {
  rootDir: string;
  requestedTarget: RequestedTarget;
}

export interface CheckResult {
  reports: HealthReport[];
}

function classifyStatus(
  commandFilesPresent: number,
  expectedCommandFiles: number,
  manifestInstalled: boolean,
  issues: HealthIssue[]
): HealthReport["status"] {
  if (commandFilesPresent === 0 && !manifestInstalled) {
    return "missing";
  }

  if (issues.length > 0) {
    if (commandFilesPresent > 0 && commandFilesPresent < expectedCommandFiles) {
      return "partial";
    }

    return "unhealthy";
  }

  return "healthy";
}

export async function runCheck(options: CheckOptions): Promise<CheckResult> {
  const manifest = await loadManifest(options.rootDir);
  const selectedTargets = resolveTargets(options.requestedTarget);
  const reports: HealthReport[] = [];

  for (const target of selectedTargets) {
    const adapter = getAdapter(target);
    const targetAssets = getTargetAssetDefinitions(target);
    const targetState = manifest?.targets.find((entry) => entry.target === target);
    const issues: HealthIssue[] = [];
    let presentCount = 0;

    for (const asset of targetAssets) {
      const absolutePath = joinProjectPath(options.rootDir, asset.targetPath);
      if (await pathExists(absolutePath)) {
        presentCount += 1;
      } else if (targetState?.installed) {
        issues.push({
          code: "TARGET_ASSET_MISSING",
          severity: "error",
          message: `Expected managed asset is missing: ${asset.targetPath}`,
          path: asset.targetPath
        });
      }
    }

    for (const asset of sharedAssetRegistry) {
      const absolutePath = joinProjectPath(options.rootDir, asset.targetPath);
      if (!(await pathExists(absolutePath))) {
        issues.push({
          code: "SHARED_ASSET_MISSING",
          severity: "warning",
          message: `Shared template is missing: ${asset.targetPath}`,
          path: asset.targetPath
        });
      }
    }

    const legacyProductDir = joinProjectPath(options.rootDir, LEGACY_PRODUCT_DOCS_DIR);
    const productDir = joinProjectPath(options.rootDir, PRODUCT_DOCS_DIR);
    const legacyTemplatesDir = joinProjectPath(options.rootDir, LEGACY_PRODUCT_TEMPLATES_DIR);
    const productTemplatesDir = joinProjectPath(options.rootDir, PRODUCT_TEMPLATES_DIR);
    const hasLegacyProductDir = await pathExists(legacyProductDir);
    const hasProductDir = await pathExists(productDir);
    const hasLegacyTemplatesDir = await pathExists(legacyTemplatesDir);
    const hasProductTemplatesDir = await pathExists(productTemplatesDir);

    if (hasLegacyProductDir) {
      issues.push({
        code: "LEGACY_PRODUCT_DIRECTORY",
        severity: hasProductDir ? "warning" : "error",
        message: hasProductDir
          ? "Legacy /.product directory still exists. product-spec now writes docs to /product."
          : "Legacy /.product directory detected. product-spec now writes docs to /product.",
        path: LEGACY_PRODUCT_DOCS_DIR
      });
    }

    if (hasLegacyTemplatesDir && !hasProductTemplatesDir) {
      issues.push({
        code: "LEGACY_TEMPLATE_DIRECTORY",
        severity: "warning",
        message: "Shared templates are still stored in /.product/templates; rerun `product-spec add` to migrate them to /product/templates.",
        path: LEGACY_PRODUCT_TEMPLATES_DIR
      });
    }

    if (!manifest && presentCount > 0) {
      issues.push({
        code: "MANIFEST_MISSING",
        severity: "warning",
        message: "Managed files exist but .product-spec/manifest.json is missing."
      });
    }

    issues.push(
      ...(await adapter.describeHealthIssues({
        rootDir: options.rootDir,
        targetAssets: (targetState?.assets ?? []).filter((asset) => asset.target === target)
      }))
    );

    const manifestAligned = Boolean(targetState?.installed) || presentCount === 0;
    const status = classifyStatus(presentCount, targetAssets.length, Boolean(targetState?.installed), issues);
    const recommendedAction =
      status === "healthy"
        ? "No action needed."
        : status === "missing"
          ? `Run \`product-spec add ${target}\` to install this integration.`
          : `Run \`product-spec add ${target}\` to refresh managed files and migrate legacy /.product content into /product when possible, then \`product-spec check ${target}\` again. The canonical workflow ends with \`current-truth.md\` maintained by \`align\`.`;

    reports.push({
      target,
      status,
      issues,
      recommendedAction,
      manifestAligned
    });
  }

  return { reports };
}
