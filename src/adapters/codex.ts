import type { AssistantAdapter, AdapterHealthContext } from "./types.js";
import type { HealthIssue } from "../types/index.js";
import { joinProjectPath, pathExists } from "../core/fs/project.js";

async function describeHealthIssues(context: AdapterHealthContext): Promise<HealthIssue[]> {
  const issues: HealthIssue[] = [];

  for (const asset of context.targetAssets) {
    const absolutePath = joinProjectPath(context.rootDir, asset.targetPath);
    if (!(await pathExists(absolutePath))) {
      issues.push({
        code: "CODEX_MISSING_FILE",
        severity: "error",
        message: `Missing Codex asset ${asset.targetPath}`,
        path: asset.targetPath
      });
    }
  }

  return issues;
}

export const codexAdapter: AssistantAdapter = {
  key: "codex",
  displayName: "Codex",
  commandDir: ".Codex/commands",
  resolveCommandTarget(fileName: string): string {
    return `.Codex/commands/${fileName}`;
  },
  describeHealthIssues
};
