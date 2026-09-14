"use client";

import { useState } from "react";
import { Camera, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { MealAnalysis } from "@/types";

const nutrientLabels: Array<[keyof MealAnalysis, string, string]> = [
  ["calories", "Calories", "kcal"],
  ["protein", "Protein", "g"],
  ["carbs", "Carbohydrates", "g"],
  ["fat", "Fat", "g"],
  ["saturatedFat", "Saturated fat", "g"],
  ["fiber", "Fiber", "g"],
  ["sugar", "Sugar", "g"],
  ["sodium", "Sodium", "mg"],
  ["potassium", "Potassium", "mg"],
  ["calcium", "Calcium", "mg"],
  ["iron", "Iron", "mg"],
  ["magnesium", "Magnesium", "mg"],
  ["cholesterolMg", "Dietary cholesterol", "mg"]
];

export default function FoodPage() {
  const [analysis, setAnalysis] = useState<MealAnalysis | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function analyze(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setAnalysis(null);
    const form = new FormData(event.currentTarget);
    if (!form.get("mealType")) form.set("mealType", "Food");
    const res = await fetch("/api/meal/analyze", { method: "POST", body: form });
    const body = await res.json();
    setLoading(false);
    if (!res.ok) return setMessage(body.error || "Food analysis failed");
    setAnalysis(body.analysis);
    setImageUrl(body.imageUrl);
  }

  async function save() {
    if (!analysis) return;
    setSaving(true);
    setMessage("");
    const saved = window.localStorage.getItem("trackItUser");
    const userId = saved ? JSON.parse(saved).id : "demo-user";
    const res = await fetch("/api/meal/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        date: new Date().toISOString(),
        mealType: "Food Scan",
        imageUrl,
        aiPrediction: analysis,
        userCorrected: analysis,
        correctionMade: false
      })
    });
    setSaving(false);
    setMessage(res.ok ? "Saved to your cholesterol tracker." : "Could not save this scan. Check MongoDB settings.");
  }

  return (
    <div className="grid gap-6 pb-20 lg:grid-cols-[420px_1fr]">
      <div className="grid content-start gap-6">
        <div>
          <h1 className="text-3xl font-semibold">Food Scan</h1>
          <p className="mt-2 text-muted-foreground">Upload a food photo to see estimated nutrition, minerals, and cholesterol impact.</p>
        </div>
        <Card>
          <CardHeader><CardTitle>Upload food photo</CardTitle></CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={analyze}>
              <input type="hidden" name="mealType" value="Food" />
              <div className="grid gap-2">
                <Label htmlFor="photo">Photo</Label>
                <Input id="photo" name="photo" type="file" accept="image/*" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" placeholder="Optional: portion size, ingredients, restaurant name..." />
              </div>
              <Button disabled={loading}>
                <Camera className="h-4 w-4" />
                {loading ? "Analyzing..." : "Analyze Nutrition"}
              </Button>
            </form>
            {message ? <p className="mt-4 rounded-md bg-muted p-3 text-sm">{message}</p> : null}
          </CardContent>
        </Card>
      </div>

      <div className="grid content-start gap-6">
        {!analysis ? (
          <Card>
            <CardHeader><CardTitle>Nutrition result</CardTitle></CardHeader>
            <CardContent className="text-muted-foreground">Your result will appear here after upload.</CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>Detected food</CardTitle>
                <span className="rounded-md bg-muted px-3 py-1 text-sm">{analysis.cholesterolRisk} cholesterol risk</span>
              </CardHeader>
              <CardContent className="grid gap-3">
                {analysis.foods.map((food, index) => (
                  <div key={`${food.name}-${index}`} className="flex items-center justify-between rounded-md border p-3 text-sm">
                    <span className="font-medium">{food.name}</span>
                    <span className="text-muted-foreground">{food.quantity}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {nutrientLabels.map(([key, label, unit]) => (
                <Card key={key}>
                  <CardHeader><CardTitle className="text-sm text-muted-foreground">{label}</CardTitle></CardHeader>
                  <CardContent><div className="text-2xl font-semibold">{String(analysis[key])} <span className="text-sm text-muted-foreground">{unit}</span></div></CardContent>
                </Card>
              ))}
            </div>
            <Card>
              <CardHeader><CardTitle>What this means</CardTitle></CardHeader>
              <CardContent className="grid gap-4">
                <p className="text-sm text-muted-foreground">{analysis.reasoning}</p>
                <Button className="w-fit" disabled={saving} onClick={save}>
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Save to Tracker"}
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
