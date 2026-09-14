import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { setSessionCookie } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";

const signupSchema = z.object({
  name: z.string().min(2),
  password: z.string().min(6),
  termsAccepted: z.literal(true)
});

type ExistingUser = {
  _id: unknown;
};

export async function POST(request: Request) {
  try {
    const payload = signupSchema.parse(await request.json());
    await connectDB();
    const name = payload.name.trim();
    const existing = await User.findOne({ name }).lean<ExistingUser | null>();
    if (existing) return NextResponse.json({ error: "This username is already taken" }, { status: 409 });

    const passwordHash = await bcrypt.hash(payload.password, 12);
    const user = await User.create({
      name,
      passwordHash,
      termsAccepted: true,
      termsAcceptedAt: new Date(),
      termsVersion: "2026-09-14",
      termsAcceptedIp: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown",
      termsAcceptedUserAgent: request.headers.get("user-agent") || "unknown"
    });
    const response = NextResponse.json({ user: { name: user.name } }, { status: 201 });
    setSessionCookie(response, String(user._id));
    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Signup failed" }, { status: 400 });
  }
}
