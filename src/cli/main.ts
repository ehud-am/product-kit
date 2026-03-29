#!/usr/bin/env node

import { Command, InvalidArgumentError } from "commander";
import packageJson from "../../package.json" with { type: "json" };
import type { RequestedTarget } from "../types/index.js";
import { resolveProjectRoot, getPackageRoot } from "../core/fs/project.js";
import { registerAddCommand } from "./commands/add.js";
import { registerRemoveCommand } from "./commands/remove.js";
import { registerCheckCommand } from "./commands/check.js";
import { registerDoctorCommand } from "./commands/doctor.js";
import { registerVersionCommand } from "./commands/version.js";
import { configureHelp } from "./commands/help.js";

async function main(): Promise<void> {
  const rootDir = resolveProjectRoot(process.cwd());
  const packageRoot = getPackageRoot();

  const program = new Command();
  program
    .name("pmkit")
    .description("Manage pm-kit project integrations for Claude Code and Codex")
    .version(packageJson.version, "-V, --version", "Print the pmkit CLI version")
    .showHelpAfterError();

  registerAddCommand(program, { rootDir, packageRoot, version: packageJson.version });
  registerRemoveCommand(program, { rootDir });
  registerCheckCommand(program, { rootDir });
  registerDoctorCommand(program, { rootDir });
  registerVersionCommand(program, packageJson.version);
  configureHelp(program);

  await program.parseAsync(process.argv);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
