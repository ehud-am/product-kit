import type { Command } from "commander";

export function configureHelp(program: Command): void {
  program.addHelpText(
    "after",
    `
Examples:
  prd-kit add claude
  prd-kit add both
  prd-kit remove codex
  prd-kit check both
  prd-kit doctor claude
`
  );

  program
    .command("help")
    .description("Show help for prd-kit")
    .action(() => {
      program.outputHelp();
    });
}
