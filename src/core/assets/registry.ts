import type { AssetCategory, AssistantTarget } from "../../types/index.js";

export const PRODUCT_DOCS_DIR = "product";
export const LEGACY_PRODUCT_DOCS_DIR = ".product";
export const PRODUCT_TEMPLATES_DIR = `${PRODUCT_DOCS_DIR}/templates`;
export const LEGACY_PRODUCT_TEMPLATES_DIR = `${LEGACY_PRODUCT_DOCS_DIR}/templates`;

export interface AssetDefinition {
  id: string;
  category: AssetCategory;
  target: AssistantTarget | "shared";
  sourcePath: string;
  targetPath: string;
}

const assistantCommands = [
  "product-spec-domain.md",
  "product-spec-press.md",
  "product-spec-faq.md",
  "product-spec-narrative.md",
  "product-spec-roadmap.md",
  "product-spec-align.md"
];

const sharedTemplates = [
  "domain-template.md",
  "press-template.md",
  "faq-template.md",
  "narrative-template.md",
  "roadmap-template.md",
  "current-truth-template.md"
];

const historyTemplates = [
  "domain-history-template.md",
  "press-history-template.md",
  "faq-history-template.md",
  "narrative-history-template.md",
  "roadmap-history-template.md",
  "current-truth-history-template.md"
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
  const primaryAssets = sharedTemplates.map((fileName) => buildSharedAsset(fileName, "product-template"));
  const historyAssets = historyTemplates.map((fileName) =>
    buildSharedAsset(fileName, "product-history-template", "history")
  );

  return [...primaryAssets, ...historyAssets];
}

function buildSharedAsset(
  fileName: string,
  category: AssetCategory,
  subdir?: string
): AssetDefinition {
  const relativeDir = subdir ? `assets/product/templates/${subdir}` : "assets/product/templates";
  const targetDir = subdir ? `${PRODUCT_TEMPLATES_DIR}/${subdir}` : PRODUCT_TEMPLATES_DIR;

  return {
    id: `shared/${fileName.replace(/\.md$/, "")}`,
    category,
    target: "shared",
    sourcePath: `${relativeDir}/${fileName}`,
    targetPath: `${targetDir}/${fileName}`
  };
}

export const assistantAssetRegistry: Record<AssistantTarget, AssetDefinition[]> = {
  claude: buildAssistantAssets("claude", ".claude/commands"),
  codex: buildAssistantAssets("codex", ".Codex/commands")
};

export const sharedAssetRegistry = buildSharedAssets();

export function getTargetAssetDefinitions(target: AssistantTarget): AssetDefinition[] {
  return assistantAssetRegistry[target];
}
