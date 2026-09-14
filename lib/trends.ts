import { CholesterolTrend } from "@/lib/models/CholesterolTrend";
import { LipidReport } from "@/lib/models/LipidReport";

type TrendDirection = "decreasing" | "increasing" | "unchanged" | "not_enough_data";

export async function rebuildCholesterolTrend(userId: string) {
  const reports = await LipidReport.find({ userId }).sort({ reportDate: 1 }).lean();
  const points = reports.map((report: any) => ({
    reportId: String(report._id),
    reportDate: report.reportDate,
    totalCholesterol: report.totalCholesterol,
    LDL: report.LDL,
    HDL: report.HDL,
    triglycerides: report.triglycerides,
    VLDL: report.VLDL,
    nonHDL: report.nonHDL
  }));

  const latest = points.at(-1);
  const previous = points.at(-2);
  const ldlChange = latest && previous ? Number((latest.LDL - previous.LDL).toFixed(1)) : null;
  const direction: TrendDirection = ldlChange === null
    ? "not_enough_data"
    : ldlChange < 0
      ? "decreasing"
      : ldlChange > 0
        ? "increasing"
        : "unchanged";

  return CholesterolTrend.findOneAndUpdate(
    { userId },
    {
      userId,
      generatedAt: new Date(),
      points,
      sourceReportCount: points.length,
      firstReportDate: points.at(0)?.reportDate,
      latestReportDate: latest?.reportDate,
      latestLDL: latest?.LDL,
      previousLDL: previous?.LDL,
      ldlChange,
      direction
    },
    { new: true, upsert: true }
  ).lean();
}

export async function getStoredCholesterolTrend(userId: string) {
  const trend = await CholesterolTrend.findOne({ userId }).lean();
  if (trend) {
    const reportCount = await LipidReport.countDocuments({ userId });
    const pointCount = Array.isArray((trend as any).points) ? (trend as any).points.length : 0;
    if ((trend as any).sourceReportCount === reportCount && pointCount === reportCount) return trend;
  }
  return rebuildCholesterolTrend(userId);
}
