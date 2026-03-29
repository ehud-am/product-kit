import path from "node:path";
import { z } from "zod";
import type {
  AssetRecord,
  AssistantTarget,
  LastOperation,
  ManagedManifest,
  ManagedTargetState
} from "../../types/index.js";
import { pathExists, readText, writeJsonAtomic } from "../fs/project.js";

export const MANIFEST_VERSION = "1";
export const MANIFEST_RELATIVE_PATH = ".pmkit/manifest.json";

const assetRecordSchema = z.object({
  id: z.string(),
  category: z.enum(["assistant-command", "product-template"]),
  sourcePath: z.string(),
  targetPath: z.string(),
  target: z.enum(["claude", "codex", "shared"]),
  checksum: z.string(),
  managed: z.boolean()
});

const managedTargetStateSchema = z.object({
  target: z.enum(["claude", "codex"]),
  installed: z.boolean(),
  assets: z.array(assetRecordSchema),
  lastOperation: z.enum(["add", "remove", "check", "doctor"]),
  lastHealthyAt: z.string().optional()
});

const managedManifestSchema = z.object({
  manifestVersion: z.string(),
  pmkitVersion: z.string(),
  projectRoot: z.string(),
  targets: z.array(managedTargetStateSchema),
  sharedAssets: z.array(assetRecordSchema),
  updatedAt: z.string()
});

export function manifestPath(rootDir: string): string {
  return path.join(rootDir, MANIFEST_RELATIVE_PATH);
}

export async function loadManifest(rootDir: string): Promise<ManagedManifest | null> {
  const targetPath = manifestPath(rootDir);
  if (!(await pathExists(targetPath))) {
    return null;
  }

  const parsed = JSON.parse(await readText(targetPath));
  return managedManifestSchema.parse(parsed);
}

export async function saveManifest(rootDir: string, manifest: ManagedManifest): Promise<void> {
  await writeJsonAtomic(manifestPath(rootDir), manifest);
}

export async function removeManifest(rootDir: string): Promise<void> {
  const targetPath = manifestPath(rootDir);
  if (await pathExists(targetPath)) {
    const { removeIfExists } = await import("../fs/project.js");
    await removeIfExists(targetPath);
  }
}

export function createEmptyManifest(rootDir: string, pmkitVersion: string): ManagedManifest {
  return {
    manifestVersion: MANIFEST_VERSION,
    pmkitVersion,
    projectRoot: ".",
    targets: [],
    sharedAssets: [],
    updatedAt: new Date().toISOString()
  };
}

export function getTargetState(
  manifest: ManagedManifest,
  target: AssistantTarget
): ManagedTargetState | undefined {
  return manifest.targets.find((entry) => entry.target === target);
}

export function upsertTargetState(
  manifest: ManagedManifest,
  state: ManagedTargetState
): ManagedManifest {
  const nextTargets = manifest.targets.filter((entry) => entry.target !== state.target);
  nextTargets.push(state);
  return {
    ...manifest,
    targets: nextTargets.sort((left, right) => left.target.localeCompare(right.target)),
    updatedAt: new Date().toISOString()
  };
}

export function removeTargetState(
  manifest: ManagedManifest,
  target: AssistantTarget
): ManagedManifest {
  return {
    ...manifest,
    targets: manifest.targets.filter((entry) => entry.target !== target),
    updatedAt: new Date().toISOString(),
    sharedAssets: manifest.sharedAssets
  } as ManagedManifest;
}

export function setSharedAssets(manifest: ManagedManifest, assets: AssetRecord[]): ManagedManifest {
  return {
    ...manifest,
    sharedAssets: assets,
    updatedAt: new Date().toISOString()
  };
}

export function manifestHasInstalledTargets(manifest: ManagedManifest): boolean {
  return manifest.targets.some((target) => target.installed);
}
