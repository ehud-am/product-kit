import type { Command } from "commander";
import { runCheck } from "../../core/orchestration/check.js";
import { formatCheckResult } from "../output/reporter.js";
import { parseRequestedTarget } from "./targets.js";

export function registerCheckCommand(program: Command, context: { rootDir: string }): void {
  program
    .command("check")
    .argument("[target]", "claude, codex, or both", "both")
    .description("Validate integration health for one or all supported assistants")
    .action(async (target: string | undefined) => {
      const result = await runCheck({
        rootDir: context.rootDir,
        requestedTarget: parseRequestedTarget(target, "both")
      });
      process.stdout.write(formatCheckResult(result));
    });
}
