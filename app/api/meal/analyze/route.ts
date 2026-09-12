import { NextResponse } from "next/server";
import { analyzeMealImage } from "@/lib/openai";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("photo");
    const mealType = String(form.get("mealType") || "Meal");
    const notes = String(form.get("notes") || "");
    if (!(file instanceof File)) return NextResponse.json({ error: "Meal photo is required" }, { status: 400 });
    const buffer = Buffer.from(await file.arrayBuffer());
    const imageDataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
    const analysis = await analyzeMealImage(imageDataUrl, mealType, notes);
    return NextResponse.json({ analysis, imageUrl: imageDataUrl });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Meal analysis failed" }, { status: 500 });
  }
}
