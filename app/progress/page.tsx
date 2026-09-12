"use client";

import { useEffect, useState } from "react";
import { MetricCard } from "@/components/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Progress = {
  totalDaysTracked: number;
  mealsLogged: number;
  bestStreak: number;
  ldlFriendlyDaysPct: number;
  averageFiber: number;
  averageSaturatedFat: number;
};

export default function ProgressPage() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/progress")
      .then((res) => res.ok ? res.json() : res.json().then((body) => Promise.reject(body)))
      .then((body) => setProgress(body.progress))
      .catch((err) => setError(err.error || "Progress data unavailable."));
  }, []);

  if (error) return <Card><CardHeader><CardTitle>Progress needs data</CardTitle></CardHeader><CardContent className="text-muted-foreground">{error}</CardContent></Card>;
  if (!progress) return <div className="h-40 animate-pulse rounded-lg bg-muted" />;

  const indicator = progress.ldlFriendlyDaysPct >= 70 ? "bg-emerald-600" : progress.ldlFriendlyDaysPct >= 40 ? "bg-amber-500" : "bg-red-600";

  return (
    <div className="grid gap-6 pb-20">
      <div>
        <h1 className="text-3xl font-semibold">Progress</h1>
        <p className="mt-2 text-muted-foreground">Green, amber, and red indicators show how often tracked days support LDL improvement.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard label="Total Days Tracked" value={progress.totalDaysTracked} />
        <MetricCard label="Meals Logged" value={progress.mealsLogged} />
        <MetricCard label="Best Streak" value={`${progress.bestStreak} days`} />
        <MetricCard label="LDL-Friendly Days" value={`${progress.ldlFriendlyDaysPct}%`} />
        <MetricCard label="Average Fiber" value={`${progress.averageFiber} g`} />
        <MetricCard label="Average Saturated Fat" value={`${progress.averageSaturatedFat} g`} />
      </div>
      <Card>
        <CardHeader><CardTitle>LDL-Friendly Days</CardTitle></CardHeader>
        <CardContent>
          <div className="h-4 overflow-hidden rounded-md bg-muted">
            <div className={`h-full ${indicator}`} style={{ width: `${progress.ldlFriendlyDaysPct}%` }} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
