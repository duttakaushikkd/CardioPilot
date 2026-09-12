"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { FoodItem, MealAnalysis } from "@/types";

export default function ReviewMealPage() {
  const router = useRouter();
  const [pending, setPending] = useState<any>(null);
  const [analysis, setAnalysis] = useState<MealAnalysis | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("pendingMeal");
    if (raw) {
      const parsed = JSON.parse(raw);
      setPending(parsed);
      setAnalysis(parsed.analysis);
    }
  }, []);

  const correctionMade = useMemo(() => JSON.stringify(analysis) !== JSON.stringify(pending?.analysis), [analysis, pending]);

  if (!analysis) return <Card><CardHeader><CardTitle>No meal awaiting review</CardTitle></CardHeader><CardContent className="text-muted-foreground">Analyze a meal first.</CardContent></Card>;

  function updateFood(index: number, patch: Partial<FoodItem>) {
    setAnalysis((current) => current && { ...current, foods: current.foods.map((food, i) => i === index ? { ...food, ...patch } : food) });
  }

  function updateMetric(key: keyof MealAnalysis, value: string) {
    setAnalysis((current) => current && { ...current, [key]: key === "reasoning" || key === "cholesterolRisk" ? value : Number(value) });
  }

  async function save() {
    setSaving(true);
    const res = await fetch("/api/meal/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: pending.date,
        mealType: pending.mealType,
        imageUrl: pending.imageUrl,
        aiPrediction: pending.analysis,
        userCorrected: analysis,
        correctionMade
      })
    });
    setSaving(false);
    if (res.ok) {
      sessionStorage.removeItem("pendingMeal");
      router.push("/dashboard");
    }
  }

  return (
    <div className="grid gap-6 pb-20">
      <div>
        <h1 className="text-3xl font-semibold">Edit Before Save</h1>
        <p className="mt-2 text-muted-foreground">Correct the AI prediction. The saved entry uses your reviewed version.</p>
      </div>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Foods detected</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setAnalysis({ ...analysis, foods: [...analysis.foods, { name: "", quantity: "", confidence: 1 }] })}>
            <Plus className="h-4 w-4" /> Add
          </Button>
        </CardHeader>
        <CardContent className="grid gap-3">
          {analysis.foods.map((food, index) => (
            <div key={index} className="grid gap-2 rounded-md border p-3 sm:grid-cols-[1fr_1fr_auto]">
              <Input value={food.name} aria-label="Food name" onChange={(e) => updateFood(index, { name: e.target.value })} />
              <Input value={food.quantity} aria-label="Quantity" onChange={(e) => updateFood(index, { quantity: e.target.value })} />
              <Button variant="ghost" size="icon" aria-label="Delete food" onClick={() => setAnalysis({ ...analysis, foods: analysis.foods.filter((_, i) => i !== index) })}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Nutrition totals</CardTitle></CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(["calories", "protein", "carbs", "fat", "saturatedFat", "fiber", "sugar", "sodium", "healthScore"] as const).map((key) => (
            <label key={key} className="grid gap-1 text-sm">
              {key}
              <Input type="number" value={analysis[key]} onChange={(e) => updateMetric(key, e.target.value)} />
            </label>
          ))}
          <label className="grid gap-1 text-sm">
            cholesterolRisk
            <select className="h-10 rounded-md border bg-background px-3 text-sm" value={analysis.cholesterolRisk} onChange={(e) => updateMetric("cholesterolRisk", e.target.value)}>
              <option>Low</option><option>Medium</option><option>High</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm sm:col-span-2 lg:col-span-4">
            reasoning
            <Input value={analysis.reasoning} onChange={(e) => updateMetric("reasoning", e.target.value)} />
          </label>
        </CardContent>
      </Card>
      <Button className="w-fit" disabled={saving} onClick={save}>
        <Save className="h-4 w-4" />
        {saving ? "Saving..." : "Save Corrected Meal"}
      </Button>
    </div>
  );
}
