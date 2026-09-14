import { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    termsAccepted: { type: Boolean, required: true, default: false },
    termsAcceptedAt: Date,
    termsVersion: String,
    termsAcceptedIp: String,
    termsAcceptedUserAgent: String
  },
  { timestamps: true }
);

export const User = models.User || model("User", UserSchema);
