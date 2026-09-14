import { Schema, models, model } from "mongoose";

const FoodSchema = new Schema(
  {
    name: String,
    quantity: String,
    confidence: Number
  },
  { _id: false }
);

const AnalysisSchema = new Schema(
  {
    foods: [FoodSchema],
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    saturatedFat: Number,
    fiber: Number,
    sugar: Number,
    sodium: Number,
    potassium: Number,
    calcium: Number,
    iron: Number,
    magnesium: Number,
    cholesterolMg: Number,
    healthScore: Number,
    cholesterolRisk: { type: String, enum: ["Low", "Medium", "High"] },
    reasoning: String
  },
  { _id: false }
);

const MealEntrySchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    date: { type: Date, required: true, index: true },
    mealType: { type: String, required: true },
    imageUrl: String,
    aiPrediction: AnalysisSchema,
    userCorrected: AnalysisSchema,
    correctionMade: { type: Boolean, default: false },
    healthScore: Number,
    cholesterolRisk: { type: String, enum: ["Low", "Medium", "High"] },
    reasoning: String
  },
  { timestamps: true }
);

export const MealEntry = models.MealEntry || model("MealEntry", MealEntrySchema);
