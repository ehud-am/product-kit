import type { AssistantTarget, AssetRecord, HealthIssue } from "../types/index.js";

export interface AdapterHealthContext {
  rootDir: string;
  targetAssets: AssetRecord[];
}

export interface AssistantAdapter {
  key: AssistantTarget;
  displayName: string;
  commandDir: string;
  resolveCommandTarget(fileName: string): string;
  describeHealthIssues(context: AdapterHealthContext): Promise<HealthIssue[]>;
}
