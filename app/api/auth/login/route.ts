import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { setSessionCookie } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";

const loginSchema = z.object({
  name: z.string().min(2),
  password: z.string().min(6)
});

type AuthUser = {
  _id: unknown;
  name?: string;
  username?: string;
  passwordHash: string;
};

export async function POST(request: Request) {
  try {
    const payload = loginSchema.parse(await request.json());
    await connectDB();
    const name = payload.name.trim();
    const user = await User.findOne({
      $or: [{ name }, { username: name }]
    }).lean<AuthUser | null>();
    if (!user?.passwordHash) return NextResponse.json({ error: "Username or password is incorrect" }, { status: 401 });
    const passwordMatches = await bcrypt.compare(payload.password, user.passwordHash);
    if (!passwordMatches) return NextResponse.json({ error: "Username or password is incorrect" }, { status: 401 });
    const response = NextResponse.json({ user: { name: user.name || user.username || name } });
    setSessionCookie(response, String(user._id));
    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Login failed" }, { status: 400 });
  }
}
