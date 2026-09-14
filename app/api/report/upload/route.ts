import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { LipidReport } from "@/lib/models/LipidReport";
import { extractLipidReport } from "@/lib/openai";
import { parseReportDate } from "@/lib/date";
import { rebuildCholesterolTrend } from "@/lib/trends";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("report");
    const userId = await requireUserId();
    if (!(file instanceof File)) return NextResponse.json({ error: "Report file is required" }, { status: 400 });
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileDataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
    const extraction = await extractLipidReport(fileDataUrl, file.name, file.type);
    const reportDate = parseReportDate(extraction.reportDate);
    await connectDB();
    const report = await LipidReport.create({ ...extraction, reportDate, userId, sourceFileName: file.name });
    const trend = await rebuildCholesterolTrend(userId);
    return NextResponse.json({ report, trend });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Report upload failed";
    return NextResponse.json({ error: message }, { status: message.includes("login") ? 401 : 500 });
  }
}
