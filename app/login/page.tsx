"use client";

import { useState } from "react";
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
      email: String(form.get("email") || "")
    };
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const body = await res.json();
    setLoading(false);
    if (!res.ok) return setError(body.error || "Login failed");
    window.localStorage.setItem("trackItUser", JSON.stringify({ name: body.user.name, email: body.user.email, id: body.user._id }));
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="mx-auto grid max-w-md gap-6 pb-20">
      <div>
        <h1 className="text-3xl font-semibold">Login</h1>
        <p className="mt-2 text-muted-foreground">Use your name and email to keep food scans and lipid reports together.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Track It account</CardTitle></CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={onSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" autoComplete="name" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" autoComplete="email" required />
            </div>
            <Button disabled={loading}>
              <LogIn className="h-4 w-4" />
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
          {error ? <p className="mt-4 rounded-md bg-red-100 p-3 text-sm text-red-900">{error}</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
