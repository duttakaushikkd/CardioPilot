"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      password: String(form.get("password") || "")
    };
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const body = await res.json();
    setLoading(false);
    if (!res.ok) return setError(body.error || "Login failed");
    window.localStorage.setItem("trackItUser", JSON.stringify({ name: body.user.name }));
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="mx-auto grid max-w-md gap-6 pb-20">
      <div>
        <h1 className="text-3xl font-semibold">Login</h1>
        <p className="mt-2 text-muted-foreground">Use your username and password to open your Track It dashboard.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Track It account</CardTitle></CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={onSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="name">Username</Label>
              <Input id="name" name="name" autoComplete="username" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" autoComplete="current-password" required />
            </div>
            <Button disabled={loading}>
              <LogIn className="h-4 w-4" />
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <p className="mt-4 text-sm text-muted-foreground">
            New to Track It? <Link href="/signup" className="font-medium text-emerald-700 underline underline-offset-4">Create an account</Link>
          </p>
          {error ? <p className="mt-4 rounded-md bg-red-100 p-3 text-sm text-red-900">{error}</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
