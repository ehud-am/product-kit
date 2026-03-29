import { createHash } from "node:crypto";
import { mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function getPackageRoot(): string {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
}

export function resolveProjectRoot(cwd: string): string {
  return path.resolve(cwd);
}

export async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

export async function ensureDirectory(targetPath: string): Promise<void> {
  await mkdir(targetPath, { recursive: true });
}

export async function readText(targetPath: string): Promise<string> {
  return readFile(targetPath, "utf8");
}

export async function writeText(targetPath: string, contents: string): Promise<void> {
  await ensureDirectory(path.dirname(targetPath));
  await writeFile(targetPath, contents, "utf8");
}

export async function writeJsonAtomic(targetPath: string, value: unknown): Promise<void> {
  const tempPath = `${targetPath}.tmp`;
  await ensureDirectory(path.dirname(targetPath));
  await writeFile(tempPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(tempPath, targetPath);
}

export async function removeIfExists(targetPath: string): Promise<boolean> {
  if (!(await pathExists(targetPath))) {
    return false;
  }
  await rm(targetPath, { force: true, recursive: false });
  return true;
}

export async function hashFile(targetPath: string): Promise<string> {
  const contents = await readFile(targetPath);
  return createHash("sha256").update(contents).digest("hex");
}

export function relativeFromRoot(rootDir: string, targetPath: string): string {
  return path.relative(rootDir, targetPath).split(path.sep).join("/");
}

export function joinProjectPath(rootDir: string, relativePath: string): string {
  return path.join(rootDir, ...relativePath.split("/"));
}

export function assertInsideRoot(rootDir: string, candidatePath: string): void {
  const relative = path.relative(rootDir, candidatePath);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Refusing to operate outside project root: ${candidatePath}`);
  }
}

export async function removeEmptyDirectoryIfExists(targetPath: string): Promise<void> {
  try {
    await rm(targetPath, { recursive: false });
  } catch {
    // Ignore non-empty or missing directories.
  }
}
