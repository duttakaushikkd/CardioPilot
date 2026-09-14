import { z } from "zod";

export const foodItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.string().min(1),
  confidence: z.number().min(0).max(1).optional()
});

export const mealAnalysisSchema = z.object({
  foods: z.array(foodItemSchema).min(1),
  calories: z.number().nonnegative(),
  protein: z.number().nonnegative(),
  carbs: z.number().nonnegative(),
  fat: z.number().nonnegative(),
  saturatedFat: z.number().nonnegative(),
  fiber: z.number().nonnegative(),
  sugar: z.number().nonnegative(),
  sodium: z.number().nonnegative(),
  potassium: z.number().nonnegative(),
  calcium: z.number().nonnegative(),
  iron: z.number().nonnegative(),
  magnesium: z.number().nonnegative(),
  cholesterolMg: z.number().nonnegative(),
  healthScore: z.number().min(0).max(100),
  cholesterolRisk: z.enum(["Low", "Medium", "High"]),
  reasoning: z.string().min(1)
});

export const lipidExtractionSchema = z.object({
  reportDate: z.string().min(1),
  labName: z.string().min(1),
  totalCholesterol: z.number().nonnegative(),
  LDL: z.number().nonnegative(),
  HDL: z.number().nonnegative(),
  triglycerides: z.number().nonnegative(),
  VLDL: z.number().nonnegative(),
  nonHDL: z.number().nonnegative().optional()
});

export const mealSaveSchema = z.object({
  userId: z.string().default("demo-user"),
  date: z.string(),
  mealType: z.string().min(1),
  imageUrl: z.string().optional(),
  aiPrediction: mealAnalysisSchema,
  userCorrected: mealAnalysisSchema,
  correctionMade: z.boolean()
});
