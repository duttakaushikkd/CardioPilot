import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { MealEntry } from "@/lib/models/MealEntry";
import { mealSaveSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  try {
    const payload = mealSaveSchema.parse(await request.json());
    await connectDB();
    const saved = await MealEntry.create({
      ...payload,
      healthScore: payload.userCorrected.healthScore,
      cholesterolRisk: payload.userCorrected.cholesterolRisk,
      reasoning: payload.userCorrected.reasoning
    });
    return NextResponse.json({ meal: saved });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Meal save failed" }, { status: 500 });
  }
}
