import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { calculateProgress, getDashboardData } from "@/lib/analytics";

export async function GET(request: Request) {
  try {
    const userId = new URL(request.url).searchParams.get("userId") || "demo-user";
    await connectDB();
    const dashboard = await getDashboardData(userId);
    return NextResponse.json({ progress: calculateProgress(dashboard) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Progress load failed" }, { status: 500 });
  }
}
