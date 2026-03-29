import type { Command } from "commander";
import { runRemove } from "../../core/orchestration/remove.js";
import { formatOperationSummary } from "../output/reporter.js";
import { parseRequestedTarget } from "./targets.js";

export function registerRemoveCommand(program: Command, context: { rootDir: string }): void {
  program
    .command("remove")
    .argument("<target>", "claude, codex, or both")
    .description("Remove prd-kit-managed integration files from the current project")
    .action(async (target: string) => {
      const summary = await runRemove({
        rootDir: context.rootDir,
        requestedTarget: parseRequestedTarget(target)
      });
      process.stdout.write(formatOperationSummary("remove", summary));
    });
}
