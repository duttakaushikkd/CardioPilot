import { getStoredCholesterolTrend } from "@/lib/trends";

export async function getDashboardData(userId: string) {
  const trend = await getStoredCholesterolTrend(userId) as any;
  const reports = trend?.points ?? [];
  const latest = reports.at(-1);
  const previous = reports.at(-2);

  return {
    latest,
    previous,
    reports,
    ldlChange: trend?.ldlChange ?? null,
    direction: trend?.direction ?? "not_enough_data",
    generatedAt: trend?.generatedAt ?? null,
    firstReportDate: trend?.firstReportDate ?? null,
    latestReportDate: trend?.latestReportDate ?? null,
    reportCount: reports.length
  };
}

export function generateInsights(dashboard: Awaited<ReturnType<typeof getDashboardData>>) {
  if (!dashboard.latest) {
    return ["Upload your first lipid report to start tracking whether LDL is reducing."];
  }

  if (!dashboard.previous || dashboard.ldlChange === null) {
    return ["Upload one more lipid report later to compare LDL movement over time."];
  }

  if (dashboard.ldlChange < 0) {
    return [`Your LDL reduced by ${Math.abs(dashboard.ldlChange)} mg/dL compared with the previous report.`];
  }

  if (dashboard.ldlChange > 0) {
    return [`Your LDL increased by ${dashboard.ldlChange} mg/dL compared with the previous report.`];
  }

  return ["Your LDL is unchanged compared with the previous report."];
}
