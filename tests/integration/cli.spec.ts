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

describe("prd-kit CLI", () => {
  it("adds Claude and Codex assets and writes a manifest", async () => {
    const projectDir = await makeProjectDir("prd-kit-add-");

    const result = runCli(projectDir, "add", "both");

    expect(result.status).toBe(0);
    const manifest = JSON.parse(await readFile(path.join(projectDir, ".prd-kit/manifest.json"), "utf8"));
    expect(manifest.targets).toHaveLength(2);
    expect(await readFile(path.join(projectDir, ".claude/commands/prd-kit-domain.md"), "utf8")).toContain("/prd-kit-domain");
    expect(await readFile(path.join(projectDir, ".Codex/commands/prd-kit-domain.md"), "utf8")).toContain(".product/domain.md");
  });

  it("removes only prd-kit-managed files and keeps unrelated files", async () => {
    const projectDir = await makeProjectDir("prd-kit-remove-");

    expect(runCli(projectDir, "add", "both").status).toBe(0);
    await writeFile(path.join(projectDir, ".claude/commands/manual.md"), "manual", "utf8");

    const result = runCli(projectDir, "remove", "claude");

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Changed targets: claude");
    await expect(readFile(path.join(projectDir, ".claude/commands/manual.md"), "utf8")).resolves.toBe("manual");
    await expect(readFile(path.join(projectDir, ".Codex/commands/prd-kit-domain.md"), "utf8")).resolves.toContain(".product/domain.md");
  });

  it("reports unhealthy state when a managed file drifts", async () => {
    const projectDir = await makeProjectDir("prd-kit-check-");

    expect(runCli(projectDir, "add", "claude").status).toBe(0);
    await rm(path.join(projectDir, ".claude/commands/prd-kit-domain.md"));

    const check = runCli(projectDir, "check", "claude");
    const doctor = runCli(projectDir, "doctor", "claude");

    expect(check.status).toBe(0);
    expect(check.stdout).toContain("claude: partial");
    expect(doctor.stdout).toContain("Recommended action");
  });

  it("shows prd-kit in the help output", async () => {
    const projectDir = await makeProjectDir("prd-kit-help-");

    const result = runCli(projectDir, "--help");

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Usage: prd-kit");
    expect(result.stdout).not.toContain("Usage: pmkey");
  });
});
