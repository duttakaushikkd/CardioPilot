"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    const confirmPassword = String(form.get("confirmPassword") || "");
    const termsAccepted = form.get("termsAccepted") === "on";
    if (password !== confirmPassword) {
      setLoading(false);
      return setError("Passwords do not match");
    }
    if (!termsAccepted) {
      setLoading(false);
      return setError("You must accept the Terms and Conditions to create an account.");
    }

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(form.get("name") || ""),
        password,
        termsAccepted
      })
    });
    const body = await res.json();
    setLoading(false);
    if (!res.ok) return setError(body.error || "Signup failed");
    window.localStorage.setItem("trackItUser", JSON.stringify({ name: body.user.name }));
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="mx-auto grid max-w-md gap-6 pb-20">
      <div>
        <h1 className="text-3xl font-semibold">Sign up</h1>
        <p className="mt-2 text-muted-foreground">Create a Track It account with a username and password.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>New account</CardTitle></CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={onSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="name">Username</Label>
              <Input id="name" name="name" autoComplete="username" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" autoComplete="new-password" minLength={6} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" minLength={6} required />
            </div>
            <label className="flex items-start gap-3 rounded-md border p-3 text-sm">
              <input name="termsAccepted" type="checkbox" className="mt-1 h-4 w-4 accent-emerald-700" required />
              <span className="text-muted-foreground">
                I agree to the <Link href="/terms" className="font-medium text-emerald-700 underline underline-offset-4">Terms and Conditions</Link>, including that Track It is informational and not a substitute for medical advice.
              </span>
            </label>
            <Button disabled={loading}>
              <UserPlus className="h-4 w-4" />
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </form>
          <p className="mt-4 text-sm text-muted-foreground">
            Already have an account? <Link href="/login" className="font-medium text-emerald-700 underline underline-offset-4">Login</Link>
          </p>
          {error ? <p className="mt-4 rounded-md bg-red-100 p-3 text-sm text-red-900">{error}</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
