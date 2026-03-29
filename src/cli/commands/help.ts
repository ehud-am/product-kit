import type { Command } from "commander";

export function configureHelp(program: Command): void {
  program.addHelpText(
    "after",
    `
Examples:
  pmkit add claude
  pmkit add both
  pmkit remove codex
  pmkit check both
  pmkit doctor claude
`
  );

  program
    .command("help")
    .description("Show help for pmkit")
    .action(() => {
      program.outputHelp();
    });
}
