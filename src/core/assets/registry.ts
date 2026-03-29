import type { AssetCategory, AssistantTarget } from "../../types/index.js";

export interface AssetDefinition {
  id: string;
  category: AssetCategory;
  target: AssistantTarget | "shared";
  sourcePath: string;
  targetPath: string;
}

const assistantCommands = ["pmkit-domain.md", "pmkit-press.md", "pmkit-faq.md", "pmkit-align.md"];
const sharedTemplates = [
  "domain-template.md",
  "press-template.md",
  "faq-template.md",
  "requirements-template.md"
];

function buildAssistantAssets(target: AssistantTarget, commandDir: string): AssetDefinition[] {
  return assistantCommands.map((fileName) => ({
    id: `${target}/${fileName.replace(/\.md$/, "")}`,
    category: "assistant-command",
    target,
    sourcePath: `assets/${target}/commands/${fileName}`,
    targetPath: `${commandDir}/${fileName}`
  }));
}

function buildSharedAssets(): AssetDefinition[] {
  return sharedTemplates.map((fileName) => ({
    id: `shared/${fileName.replace(/\.md$/, "")}`,
    category: "product-template",
    target: "shared",
    sourcePath: `assets/product/templates/${fileName}`,
    targetPath: `.product/templates/${fileName}`
  }));
}

export const assistantAssetRegistry: Record<AssistantTarget, AssetDefinition[]> = {
  claude: buildAssistantAssets("claude", ".claude/commands"),
  codex: buildAssistantAssets("codex", ".Codex/commands")
};

export const sharedAssetRegistry = buildSharedAssets();

export function getTargetAssetDefinitions(target: AssistantTarget): AssetDefinition[] {
  return assistantAssetRegistry[target];
}
