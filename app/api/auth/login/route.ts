import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";

const loginSchema = z.object({
  name: z.string().min(2),
  email: z.string().email()
});

export async function POST(request: Request) {
  try {
    const payload = loginSchema.parse(await request.json());
    await connectDB();
    const user = await User.findOneAndUpdate(
      { email: payload.email.toLowerCase() },
      { name: payload.name, email: payload.email.toLowerCase() },
      { new: true, upsert: true }
    ).lean();
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Login failed" }, { status: 400 });
  }
}
