import type { AssistantAdapter, AdapterHealthContext } from "./types.js";
import type { HealthIssue } from "../types/index.js";
import { joinProjectPath, pathExists } from "../core/fs/project.js";

async function describeHealthIssues(context: AdapterHealthContext): Promise<HealthIssue[]> {
  const issues: HealthIssue[] = [];

  for (const asset of context.targetAssets) {
    const absolutePath = joinProjectPath(context.rootDir, asset.targetPath);
    if (!(await pathExists(absolutePath))) {
      issues.push({
        code: "CLAUDE_MISSING_FILE",
        severity: "error",
        message: `Missing Claude Code asset ${asset.targetPath}`,
        path: asset.targetPath
      });
    }
  }

  return issues;
}

export const claudeAdapter: AssistantAdapter = {
  key: "claude",
  displayName: "Claude Code",
  commandDir: ".claude/commands",
  resolveCommandTarget(fileName: string): string {
    return `.claude/commands/${fileName}`;
  },
  describeHealthIssues
};
