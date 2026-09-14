import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { getDashboardData, generateInsights } from "@/lib/analytics";

export async function GET() {
  try {
    const userId = await requireUserId();
    await connectDB();
    const dashboard = await getDashboardData(userId);
    return NextResponse.json({ ...dashboard, insights: generateInsights(dashboard) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Dashboard load failed";
    return NextResponse.json({ error: message }, { status: message.includes("login") ? 401 : 500 });
  }
}
