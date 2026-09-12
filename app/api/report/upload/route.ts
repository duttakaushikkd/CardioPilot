import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { LipidReport } from "@/lib/models/LipidReport";
import { extractLipidReport } from "@/lib/openai";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("report");
    const userId = String(form.get("userId") || "demo-user");
    if (!(file instanceof File)) return NextResponse.json({ error: "Report file is required" }, { status: 400 });
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileDataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
    const extraction = await extractLipidReport(fileDataUrl, file.name, file.type);
    await connectDB();
    const report = await LipidReport.create({ ...extraction, userId, sourceFileName: file.name });
    return NextResponse.json({ report });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Report upload failed" }, { status: 500 });
  }
}
