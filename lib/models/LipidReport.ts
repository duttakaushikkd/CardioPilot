import { Schema, models, model } from "mongoose";

const LipidReportSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    reportDate: { type: Date, required: true },
    labName: { type: String, required: true },
    totalCholesterol: { type: Number, required: true },
    LDL: { type: Number, required: true },
    HDL: { type: Number, required: true },
    triglycerides: { type: Number, required: true },
    VLDL: { type: Number, required: true },
    nonHDL: Number,
    sourceFileName: String
  },
  { timestamps: true, collection: "lipid_reports" }
);

export const LipidReport = models.LipidReport || model("LipidReport", LipidReportSchema);
