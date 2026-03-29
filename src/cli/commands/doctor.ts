import type { Command } from "commander";
import { runDoctor } from "../../core/orchestration/doctor.js";
import { formatDoctorResult } from "../output/reporter.js";
import { parseRequestedTarget } from "./targets.js";

export function registerDoctorCommand(program: Command, context: { rootDir: string }): void {
  program
    .command("doctor")
    .argument("[target]", "claude, codex, or both", "both")
    .description("Show detailed diagnostics and repair guidance")
    .action(async (target: string | undefined) => {
      const result = await runDoctor({
        rootDir: context.rootDir,
        requestedTarget: parseRequestedTarget(target, "both")
      });
      process.stdout.write(formatDoctorResult(result));
    });
}
