import { readFile } from "node:fs/promises";

const files = [
  "README.md",
  "CHANGELOG.md",
  "AGENTS.md",
  "package.json",
  "src/cli/main.ts",
  "src/cli/commands/add.ts",
  "src/cli/commands/remove.ts",
  "src/cli/commands/help.ts",
  "src/cli/commands/version.ts",
  "src/cli/output/reporter.ts",
  "src/core/assets/registry.ts",
  "src/core/orchestration/add.ts",
  "src/core/orchestration/check.ts",
  "tests/integration/cli.spec.ts",
  "assets/claude/commands/prd-kit-align.md",
  "assets/claude/commands/prd-kit-domain.md",
  "assets/claude/commands/prd-kit-faq.md",
  "assets/claude/commands/prd-kit-press.md",
  "assets/codex/commands/prd-kit-align.md",
  "assets/codex/commands/prd-kit-domain.md",
  "assets/codex/commands/prd-kit-faq.md",
  "assets/codex/commands/prd-kit-press.md"
];

const allowedSubstrings = [
  ".prd-kit/manifest.json",
  "prdKitVersion",
  "github:ehud-am/prd-kit",
  "Initial prd-kit command set",
  'expect(result.stdout).not.toContain("Usage: pmkey");'
];

const forbiddenPatterns = [/pmkey/g, /pm-kit/g, /pmkit/g, /\/pmkey/g, /\/pmkit/g];
const failures = [];

for (const file of files) {
  const original = await readFile(file, "utf8");
  let sanitized = original;
  for (const allowed of allowedSubstrings) {
    sanitized = sanitized.split(allowed).join("");
  }

  const matches = [];
  for (const pattern of forbiddenPatterns) {
    const found = sanitized.match(pattern);
    if (found) {
      matches.push(...found);
    }
  }

  if (matches.length > 0) {
    failures.push(`${file}: found forbidden legacy name fragments`);
  }
}

if (failures.length > 0) {
  process.stderr.write(`${failures.join("\n")}\n`);
  process.exit(1);
}
