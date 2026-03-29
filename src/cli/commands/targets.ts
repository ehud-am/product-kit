import { InvalidArgumentError } from "commander";
import type { RequestedTarget } from "../../types/index.js";

export function parseRequestedTarget(value: string | undefined, fallback: RequestedTarget = "both"): RequestedTarget {
  const resolved = value ?? fallback;

  if (resolved === "claude" || resolved === "codex" || resolved === "both") {
    return resolved;
  }

  throw new InvalidArgumentError(`Unknown target "${resolved}". Use claude, codex, or both.`);
}
