import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { generateInsights, getDashboardData } from "@/lib/analytics";

export async function GET(request: Request) {
  try {
    const userId = new URL(request.url).searchParams.get("userId") || "demo-user";
    await connectDB();
    const dashboard = await getDashboardData(userId);
    const latest = dashboard.latest as any;
    const today = dashboard.daily.at(-1);
    const foods = dashboard.meals.flatMap((meal: any) => meal.userCorrected?.foods ?? []);
    const satFatFoods = foods.slice(0, 12).map((food: any) => `${food.name} (${food.quantity})`);
    return NextResponse.json({
      coach: {
        todayScore: today?.healthScore ?? dashboard.averages.healthScore,
        currentLDL: latest?.LDL ?? null,
        saturatedFatWatchlist: satFatFoods,
        fiberStatus: (today?.fiber ?? 0) >= 25 ? "On target" : "Below LDL-friendly target",
        suggestions: [
          "Prefer soluble-fiber foods such as oats, dal, beans, fruit, and psyllium when they fit your diet.",
          "Keep visible butter, ghee, cream, and high-fat paneer portions small on days when saturated fat is already high.",
          "Pair meals with vegetables or legumes to improve fiber density."
        ],
        hdlTips: ["Schedule brisk walking or strength training most days.", "Choose unsaturated fats such as nuts or olive oil in measured portions."],
        weeklySummary: generateInsights(dashboard)
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Coach load failed" }, { status: 500 });
  }
}
