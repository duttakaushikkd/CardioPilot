import { MealEntry } from "@/lib/models/MealEntry";
import { LipidReport } from "@/lib/models/LipidReport";

export async function getDashboardData(userId = "demo-user") {
  const [reports, meals] = await Promise.all([
    LipidReport.find({ userId }).sort({ reportDate: 1 }).lean(),
    MealEntry.find({ userId }).sort({ date: -1 }).limit(120).lean()
  ]);
  const latest = reports.at(-1);
  const byDay = new Map<string, { calories: number; saturatedFat: number; fiber: number; healthScore: number; count: number }>();
  for (const meal of meals) {
    const day = new Date(meal.date as Date).toISOString().slice(0, 10);
    const corrected = meal.userCorrected as any;
    const existing = byDay.get(day) ?? { calories: 0, saturatedFat: 0, fiber: 0, healthScore: 0, count: 0 };
    existing.calories += corrected?.calories ?? 0;
    existing.saturatedFat += corrected?.saturatedFat ?? 0;
    existing.fiber += corrected?.fiber ?? 0;
    existing.healthScore += corrected?.healthScore ?? 0;
    existing.count += 1;
    byDay.set(day, existing);
  }
  const daily = [...byDay.entries()].map(([date, value]) => ({ date, ...value, healthScore: Math.round(value.healthScore / Math.max(value.count, 1)) })).sort((a, b) => a.date.localeCompare(b.date));
  const totals = daily.reduce((acc, day) => ({ calories: acc.calories + day.calories, saturatedFat: acc.saturatedFat + day.saturatedFat, healthScore: acc.healthScore + day.healthScore }), { calories: 0, saturatedFat: 0, healthScore: 0 });
  return {
    latest,
    reports,
    daily,
    meals,
    averages: {
      calories: daily.length ? Math.round(totals.calories / daily.length) : 0,
      saturatedFat: daily.length ? Number((totals.saturatedFat / daily.length).toFixed(1)) : 0,
      healthScore: daily.length ? Math.round(totals.healthScore / daily.length) : 0
    }
  };
}

export function calculateProgress(dashboard: Awaited<ReturnType<typeof getDashboardData>>) {
  const days = dashboard.daily.length;
  const mealsLogged = dashboard.meals.length;
  const friendlyDays = dashboard.daily.filter((d) => d.saturatedFat <= 13 && d.fiber >= 25).length;
  const averageFiber = days ? dashboard.daily.reduce((sum, d) => sum + d.fiber, 0) / days : 0;
  const averageSaturatedFat = dashboard.averages.saturatedFat;
  return {
    totalDaysTracked: days,
    mealsLogged,
    bestStreak: getBestStreak(dashboard.daily.map((d) => d.date)),
    ldlFriendlyDaysPct: days ? Math.round((friendlyDays / days) * 100) : 0,
    averageFiber: Number(averageFiber.toFixed(1)),
    averageSaturatedFat
  };
}

function getBestStreak(dates: string[]) {
  const sorted = [...new Set(dates)].sort();
  let best = 0;
  let current = 0;
  let previous = "";
  for (const date of sorted) {
    const diff = previous ? (new Date(date).getTime() - new Date(previous).getTime()) / 86400000 : 1;
    current = diff === 1 ? current + 1 : 1;
    best = Math.max(best, current);
    previous = date;
  }
  return best;
}

export function generateInsights(dashboard: Awaited<ReturnType<typeof getDashboardData>>) {
  const last7 = dashboard.daily.slice(-7);
  const prev7 = dashboard.daily.slice(-14, -7);
  const avgSat = last7.length ? last7.reduce((sum, d) => sum + d.saturatedFat, 0) / last7.length : 0;
  const satAboveAvg = last7.filter((d) => d.saturatedFat > avgSat).length;
  const lastFiber = last7.reduce((sum, d) => sum + d.fiber, 0);
  const prevFiber = prev7.reduce((sum, d) => sum + d.fiber, 0);
  const fiberChange = prevFiber ? Math.round(((lastFiber - prevFiber) / prevFiber) * 100) : 0;
  return [
    `You consumed saturated fat above your 7-day average on ${satAboveAvg} of the last ${last7.length} tracked days.`,
    prev7.length ? `Your fiber intake changed by ${fiberChange}% compared to the previous tracked week.` : "Track another week to compare fiber intake against your previous week.",
    dashboard.averages.saturatedFat <= 13 ? "Your current saturated fat pattern is aligned with LDL reduction targets." : "Your saturated fat average is above the LDL-friendly target of about 13 g/day."
  ];
}
