import { Schema, models, model } from "mongoose";

const TrendPointSchema = new Schema(
  {
    reportId: { type: String, required: true },
    reportDate: { type: Date, required: true },
    totalCholesterol: { type: Number, required: true },
    LDL: { type: Number, required: true },
    HDL: { type: Number, required: true },
    triglycerides: { type: Number, required: true },
    VLDL: { type: Number, required: true },
    nonHDL: Number
  },
  { _id: false }
);

const CholesterolTrendSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    generatedAt: { type: Date, required: true },
    points: [TrendPointSchema],
    sourceReportCount: { type: Number, required: true, default: 0 },
    firstReportDate: Date,
    latestReportDate: Date,
    latestLDL: Number,
    previousLDL: Number,
    ldlChange: Number,
    direction: {
      type: String,
      enum: ["decreasing", "increasing", "unchanged", "not_enough_data"],
      required: true
    }
  },
  { timestamps: true, collection: "cholesterol_trends" }
);

export const CholesterolTrend = models.CholesterolTrend || model("CholesterolTrend", CholesterolTrendSchema);
