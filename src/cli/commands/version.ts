import type { Command } from "commander";

export function registerVersionCommand(program: Command, version: string): void {
  program
    .command("version")
    .description("Print the installed prd-kit CLI version")
    .action(() => {
      process.stdout.write(`${version}\n`);
    });
}
