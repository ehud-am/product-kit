import { claudeAdapter } from "../../adapters/claude.js";
import { codexAdapter } from "../../adapters/codex.js";
import type { AssistantAdapter } from "../../adapters/types.js";
import type { AssistantTarget, RequestedTarget } from "../../types/index.js";

const adapters: Record<AssistantTarget, AssistantAdapter> = {
  claude: claudeAdapter,
  codex: codexAdapter
};

export function resolveTargets(requestedTarget: RequestedTarget): AssistantTarget[] {
  if (requestedTarget === "both") {
    return ["claude", "codex"];
  }

  return [requestedTarget];
}

export function getAdapter(target: AssistantTarget): AssistantAdapter {
  return adapters[target];
}

export function getAllAdapters(): AssistantAdapter[] {
  return [claudeAdapter, codexAdapter];
}
