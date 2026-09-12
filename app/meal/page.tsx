"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AddMealPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/meal/analyze", { method: "POST", body: form });
    const body = await res.json();
    setLoading(false);
    if (!res.ok) return setError(body.error || "Meal analysis failed");
    sessionStorage.setItem("pendingMeal", JSON.stringify({ ...body, mealType: form.get("mealType"), date: new Date().toISOString() }));
    router.push("/meal/review");
  }

  return (
    <div className="grid max-w-3xl gap-6 pb-20">
      <div>
        <h1 className="text-3xl font-semibold">Add Meal</h1>
        <p className="mt-2 text-muted-foreground">Analyze a food photo, then review and correct it before anything is saved.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Meal photo</CardTitle></CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={onSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="mealType">Meal type</Label>
              <Input id="mealType" name="mealType" placeholder="Breakfast, lunch, dinner, snack" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="photo">Photo</Label>
              <Input id="photo" name="photo" type="file" accept="image/*" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" placeholder="Optional: homemade, restaurant, ingredients you know..." />
            </div>
            <Button disabled={loading}>
              <Camera className="h-4 w-4" />
              {loading ? "Analyzing..." : "Analyze Meal"}
            </Button>
          </form>
          {error ? <p className="mt-4 rounded-md bg-red-100 p-3 text-sm text-red-900">{error}</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
