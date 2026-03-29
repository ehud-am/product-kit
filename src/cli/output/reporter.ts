import type { CheckResult } from "../../core/orchestration/check.js";
import type { DoctorResult } from "../../core/orchestration/doctor.js";
import type { OperationSummary } from "../../types/index.js";

export function formatOperationSummary(action: "add" | "remove", summary: OperationSummary): string {
  const lines = [
    `pmkit ${action} ${summary.requestedTarget}`,
    `Changed targets: ${summary.changedTargets.length > 0 ? summary.changedTargets.join(", ") : "none"}`,
    `Skipped targets: ${summary.skippedTargets.length > 0 ? summary.skippedTargets.join(", ") : "none"}`
  ];

  if (summary.files.length > 0) {
    lines.push("Files:");
    for (const file of summary.files) {
      lines.push(`- ${file.action}: ${file.path}`);
    }
  }

  if (summary.notes.length > 0) {
    lines.push("Notes:");
    for (const note of summary.notes) {
      lines.push(`- ${note}`);
    }
  }

  return `${lines.join("\n")}\n`;
}

export function formatCheckResult(result: CheckResult): string {
  const lines: string[] = [];

  for (const report of result.reports) {
    lines.push(`${report.target}: ${report.status}`);
    lines.push(`- manifest aligned: ${report.manifestAligned ? "yes" : "no"}`);
    if (report.issues.length > 0) {
      for (const issue of report.issues) {
        lines.push(`- ${issue.severity}: ${issue.message}`);
      }
    }
    lines.push(`- next step: ${report.recommendedAction}`);
  }

  return `${lines.join("\n")}\n`;
}

export function formatDoctorResult(result: DoctorResult): string {
  return `${result.details.join("\n\n")}\n`;
}
