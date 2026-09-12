import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { lipidExtractionSchema, mealAnalysisSchema } from "@/lib/schemas";
import type { LipidExtraction, MealAnalysis } from "@/types";

function getClient() {
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured");
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function analyzeMealImage(imageDataUrl: string, mealType: string, notes?: string): Promise<MealAnalysis> {
  const client = getClient();
  const response = await client.responses.parse({
    model: "gpt-4o-mini",
    input: [
      {
        role: "system",
        content: "You are LipiTrack AI. Analyze a meal photo for cholesterol management. Return only strict JSON matching the schema. Estimate cautiously and state uncertainty in reasoning."
      },
      {
        role: "user",
        content: [
          { type: "input_text", text: `Meal type: ${mealType}. Notes: ${notes || "none"}` },
          { type: "input_image", image_url: imageDataUrl, detail: "auto" }
        ]
      }
    ],
    text: { format: zodTextFormat(mealAnalysisSchema, "meal_analysis") }
  });
  if (!response.output_parsed) throw new Error("OpenAI returned no structured meal analysis");
  return response.output_parsed;
}

export async function extractLipidReport(fileDataUrl: string, fileName: string, mimeType: string): Promise<LipidExtraction> {
  const client = getClient();
  const fileInput = mimeType === "application/pdf"
    ? { type: "input_file" as const, filename: fileName, file_data: fileDataUrl }
    : { type: "input_image" as const, image_url: fileDataUrl, detail: "auto" as const };
  const response = await client.responses.parse({
    model: "gpt-4o-mini",
    input: [
      {
        role: "system",
        content: "Extract lipid profile values from the uploaded report. Use mg/dL values when present. Return only strict JSON. If a value is missing, infer only when a formula is explicit."
      },
      {
        role: "user",
        content: [
          { type: "input_text", text: `File name: ${fileName}` },
          fileInput
        ]
      }
    ],
    text: { format: zodTextFormat(lipidExtractionSchema, "lipid_report") }
  });
  if (!response.output_parsed) throw new Error("OpenAI returned no structured lipid extraction");
  return response.output_parsed;
}
