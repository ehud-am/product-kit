import type { RequestedTarget } from "../../types/index.js";
import { runCheck } from "./check.js";

export interface DoctorOptions {
  rootDir: string;
  requestedTarget: RequestedTarget;
}

export interface DoctorResult {
  details: string[];
}

export async function runDoctor(options: DoctorOptions): Promise<DoctorResult> {
  const checkResult = await runCheck(options);
  const details = checkResult.reports.map((report) => {
    const issueList =
      report.issues.length === 0
        ? "No issues detected."
        : report.issues.map((issue) => `- [${issue.severity}] ${issue.message}`).join("\n");

    return [
      `## ${report.target}`,
      `Status: ${report.status}`,
      `Manifest aligned: ${report.manifestAligned ? "yes" : "no"}`,
      issueList,
      `Recommended action: ${report.recommendedAction}`
    ].join("\n");
  });

  return { details };
}
