import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { afterEach, describe, expect, it } from "vitest";

const cleanupPaths: string[] = [];

async function makeProjectDir(prefix: string): Promise<string> {
  const target = await mkdtemp(path.join(os.tmpdir(), prefix));
  cleanupPaths.push(target);
  return target;
}

function runCli(cwd: string, ...args: string[]) {
  const tsxLoader = path.resolve("node_modules/tsx/dist/loader.mjs");
  return spawnSync(
    process.execPath,
    ["--import", tsxLoader, path.resolve("src/cli/main.ts"), ...args],
    {
      cwd,
      encoding: "utf8"
    }
  );
}

afterEach(async () => {
  await Promise.all(cleanupPaths.splice(0).map((target) => rm(target, { recursive: true, force: true })));
});

describe("product-spec CLI", () => {
  it("adds Claude and Codex assets and writes a manifest", async () => {
    const projectDir = await makeProjectDir("product-spec-add-");

    const result = runCli(projectDir, "add", "both");

    expect(result.status).toBe(0);
    const manifest = JSON.parse(await readFile(path.join(projectDir, ".product-spec/manifest.json"), "utf8"));
    expect(manifest.targets).toHaveLength(2);
    expect(await readFile(path.join(projectDir, ".claude/commands/product-spec-domain.md"), "utf8")).toContain("/product-spec-domain");
    expect(await readFile(path.join(projectDir, ".Codex/commands/product-spec-domain.md"), "utf8")).toContain("docs/product/domain.md");
    expect(await readFile(path.join(projectDir, ".claude/commands/product-spec-narrative.md"), "utf8")).toContain(
      "docs/product/narrative.md"
    );
    expect(await readFile(path.join(projectDir, ".Codex/commands/product-spec-roadmap.md"), "utf8")).toContain(
      "docs/product/roadmap.md"
    );
    expect(await readFile(path.join(projectDir, "docs", "product", "templates", "current-truth-template.md"), "utf8")).toContain(
      "# Current Truth:"
    );
    expect(
      await readFile(path.join(projectDir, "docs", "product", "templates", "history", "current-truth-history-template.md"), "utf8")
    ).toContain("# Current Truth History:");
    expect(manifest.sharedAssets.every((asset: { targetPath: string }) => asset.targetPath.startsWith("docs/product/templates/"))).toBe(
      true
    );
    await expect(readFile(path.join(projectDir, "product", "templates", "current-truth-template.md"), "utf8")).rejects.toBeTruthy();
    expect(result.stdout).toContain("current-truth");
  });

  it("removes only product-spec-managed files and keeps unrelated files", async () => {
    const projectDir = await makeProjectDir("product-spec-remove-");

    expect(runCli(projectDir, "add", "both").status).toBe(0);
    await writeFile(path.join(projectDir, ".claude/commands/manual.md"), "manual", "utf8");

    const result = runCli(projectDir, "remove", "claude");

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Changed targets: claude");
    await expect(readFile(path.join(projectDir, ".claude/commands/manual.md"), "utf8")).resolves.toBe("manual");
    await expect(readFile(path.join(projectDir, ".Codex/commands/product-spec-domain.md"), "utf8")).resolves.toContain(
      "docs/product/domain.md"
    );
  });

  it("reports unhealthy state when a managed file drifts", async () => {
    const projectDir = await makeProjectDir("product-spec-check-");

    expect(runCli(projectDir, "add", "claude").status).toBe(0);
    await rm(path.join(projectDir, "docs", "product", "templates", "current-truth-template.md"));

    const check = runCli(projectDir, "check", "claude");
    const doctor = runCli(projectDir, "doctor", "claude");

    expect(check.status).toBe(0);
    expect(check.stdout).toContain("claude: unhealthy");
    expect(check.stdout).toContain("Shared template is missing: docs/product/templates/current-truth-template.md");
    expect(doctor.stdout).toContain("current-truth");
    expect(doctor.stdout).toContain("Workflow reminder");
  });

  it("installs the expanded FRFAQ workflow assets for one target", async () => {
    const projectDir = await makeProjectDir("product-spec-workflow-");

    const result = runCli(projectDir, "add", "claude");

    expect(result.status).toBe(0);
    await expect(readFile(path.join(projectDir, ".claude/commands/product-spec-narrative.md"), "utf8")).resolves.toContain(
      "/product-spec-roadmap"
    );
    await expect(readFile(path.join(projectDir, ".claude/commands/product-spec-align.md"), "utf8")).resolves.toContain(
      "current-truth.md"
    );
    await expect(readFile(path.join(projectDir, "docs", "product", "templates", "roadmap-template.md"), "utf8")).resolves.toContain(
      "## Committed Bets"
    );
    await expect(readFile(path.join(projectDir, "docs", "product", "templates", "narrative-template.md"), "utf8")).resolves.toContain(
      "## Product Promise"
    );
  });

  it("migrates an existing /product directory to /docs/product on add", async () => {
    const projectDir = await makeProjectDir("product-spec-migrate-product-");

    await mkdir(path.join(projectDir, "product", "templates"), { recursive: true });
    await writeFile(path.join(projectDir, "product", "domain.md"), "# Product domain\n", "utf8");
    await writeFile(path.join(projectDir, "product", "templates", "current-truth-template.md"), "legacy\n", "utf8");

    const result = runCli(projectDir, "add", "claude");

    expect(result.status).toBe(0);
    await expect(readFile(path.join(projectDir, "docs", "product", "domain.md"), "utf8")).resolves.toContain("# Product domain");
    await expect(
      readFile(path.join(projectDir, "docs", "product", "templates", "current-truth-template.md"), "utf8")
    ).resolves.toContain("# Current Truth:");
    await expect(readFile(path.join(projectDir, ".claude/commands/product-spec-domain.md"), "utf8")).resolves.toContain(
      "docs/product/domain.md"
    );
    await expect(readFile(path.join(projectDir, "product", "domain.md"), "utf8")).rejects.toBeTruthy();
    expect(result.stdout).toContain("Migrated legacy /product content to /docs/product.");
  });

  it("migrates an existing /.product directory to /docs/product on add", async () => {
    const projectDir = await makeProjectDir("product-spec-migrate-");

    await mkdir(path.join(projectDir, ".product", "templates"), { recursive: true });
    await writeFile(path.join(projectDir, ".product", "domain.md"), "# Legacy domain\n", "utf8");
    await writeFile(path.join(projectDir, ".product", "templates", "current-truth-template.md"), "legacy\n", "utf8");

    const result = runCli(projectDir, "add", "claude");

    expect(result.status).toBe(0);
    await expect(readFile(path.join(projectDir, "docs", "product", "domain.md"), "utf8")).resolves.toContain("# Legacy domain");
    await expect(
      readFile(path.join(projectDir, "docs", "product", "templates", "current-truth-template.md"), "utf8")
    ).resolves.toContain("# Current Truth:");
    await expect(readFile(path.join(projectDir, ".claude/commands/product-spec-domain.md"), "utf8")).resolves.toContain(
      "docs/product/domain.md"
    );
    await expect(readFile(path.join(projectDir, ".product", "domain.md"), "utf8")).rejects.toBeTruthy();
    expect(result.stdout).toContain("Migrated legacy /.product content to /docs/product.");
  });

  it("reports a non-destructive conflict when docs/product already exists alongside product", async () => {
    const projectDir = await makeProjectDir("product-spec-conflict-");

    await mkdir(path.join(projectDir, "docs", "product"), { recursive: true });
    await mkdir(path.join(projectDir, "product"), { recursive: true });
    await writeFile(path.join(projectDir, "docs", "product", "domain.md"), "# Canonical domain\n", "utf8");
    await writeFile(path.join(projectDir, "product", "domain.md"), "# Legacy domain\n", "utf8");

    const addResult = runCli(projectDir, "add", "claude");
    const checkResult = runCli(projectDir, "check", "claude");
    const doctorResult = runCli(projectDir, "doctor", "claude");

    expect(addResult.status).toBe(0);
    await expect(readFile(path.join(projectDir, "docs", "product", "domain.md"), "utf8")).resolves.toContain("# Canonical domain");
    await expect(readFile(path.join(projectDir, "product", "domain.md"), "utf8")).resolves.toContain("# Legacy domain");
    expect(addResult.stdout).toContain("Existing /docs/product content was left untouched");

    expect(checkResult.status).toBe(0);
    expect(checkResult.stdout).toContain("Legacy /product directory still exists. product-spec now writes docs to /docs/product.");
    expect(checkResult.stdout).toContain("Run `product-spec add claude` to refresh managed files and migrate legacy /product or /.product content into /docs/product when possible");
    expect(doctorResult.stdout).toContain("Recommended action:");
    expect(doctorResult.stdout).toContain("/docs/product");
  });

  it("shows product-spec in the help output", async () => {
    const projectDir = await makeProjectDir("product-spec-help-");

    const result = runCli(projectDir, "--help");

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Usage: product-spec");
    expect(result.stdout).not.toContain("Usage: pmkey");
  });
});
