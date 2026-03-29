export type AssistantTarget = "claude" | "codex";
export type RequestedTarget = AssistantTarget | "both";
export type AssetCategory = "assistant-command" | "product-template";
export type HealthStatus = "healthy" | "missing" | "partial" | "unhealthy";
export type LastOperation = "add" | "remove" | "check" | "doctor";

export interface AssetRecord {
  id: string;
  category: AssetCategory;
  sourcePath: string;
  targetPath: string;
  target: AssistantTarget | "shared";
  checksum: string;
  managed: boolean;
}

export interface ManagedTargetState {
  target: AssistantTarget;
  installed: boolean;
  assets: AssetRecord[];
  lastOperation: LastOperation;
  lastHealthyAt?: string;
}

export interface ManagedManifest {
  manifestVersion: string;
  pmkitVersion: string;
  projectRoot: string;
  targets: ManagedTargetState[];
  sharedAssets: AssetRecord[];
  updatedAt: string;
}

export interface HealthIssue {
  code: string;
  severity: "info" | "warning" | "error";
  message: string;
  path?: string;
}

export interface HealthReport {
  target: AssistantTarget | "all";
  status: HealthStatus;
  issues: HealthIssue[];
  recommendedAction: string;
  manifestAligned: boolean;
}

export interface OperationFileResult {
  path: string;
  action: "created" | "updated" | "removed" | "skipped";
}

export interface OperationSummary {
  requestedTarget: RequestedTarget;
  changedTargets: AssistantTarget[];
  skippedTargets: AssistantTarget[];
  files: OperationFileResult[];
  notes: string[];
}
