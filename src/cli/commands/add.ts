import type { Command } from "commander";
import { runAdd } from "../../core/orchestration/add.js";
import { formatOperationSummary } from "../output/reporter.js";
import { parseRequestedTarget } from "./targets.js";

export function registerAddCommand(program: Command, context: { rootDir: string; packageRoot: string; version: string }): void {
  program
    .command("add")
    .argument("<target>", "claude, codex, or both")
    .description("Add prd-kit-managed integration files to the current project")
    .action(async (target: string) => {
      const summary = await runAdd({
        rootDir: context.rootDir,
        packageRoot: context.packageRoot,
        requestedTarget: parseRequestedTarget(target),
        prdKitVersion: context.version
      });
      process.stdout.write(formatOperationSummary("add", summary));
    });
}
