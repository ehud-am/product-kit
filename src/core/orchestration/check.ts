import type { AssistantTarget, HealthIssue, HealthReport, RequestedTarget } from "../../types/index.js";
import { getTargetAssetDefinitions, sharedAssetRegistry } from "../assets/registry.js";
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

    if (!manifest && presentCount > 0) {
      issues.push({
        code: "MANIFEST_MISSING",
        severity: "warning",
        message: "Managed files exist but .prd-kit/manifest.json is missing."
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
          ? `Run \`prd-kit add ${target}\` to install this integration.`
          : `Run \`prd-kit add ${target}\` to refresh managed files, then \`prd-kit check ${target}\` again.`;

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
