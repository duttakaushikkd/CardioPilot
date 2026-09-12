export type CholesterolRisk = "Low" | "Medium" | "High";

export type FoodItem = {
  name: string;
  quantity: string;
  confidence?: number;
};

export type MealAnalysis = {
  foods: FoodItem[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  saturatedFat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  healthScore: number;
  cholesterolRisk: CholesterolRisk;
  reasoning: string;
};

export type LipidExtraction = {
  reportDate: string;
  labName: string;
  totalCholesterol: number;
  LDL: number;
  HDL: number;
  triglycerides: number;
  VLDL: number;
  nonHDL?: number;
};
