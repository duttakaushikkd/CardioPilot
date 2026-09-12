"use client";

import { useEffect, useState } from "react";
import { Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Coach = {
  todayScore: number;
  currentLDL: number | null;
  saturatedFatWatchlist: string[];
  fiberStatus: string;
  suggestions: string[];
  hdlTips: string[];
  weeklySummary: string[];
};

export default function CoachPage() {
  const [coach, setCoach] = useState<Coach | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/coach")
      .then((res) => res.ok ? res.json() : res.json().then((body) => Promise.reject(body)))
      .then((body) => setCoach(body.coach))
      .catch((err) => setError(err.error || "Coach data unavailable."));
  }, []);

  if (error) return <Card><CardHeader><CardTitle>Cardio Pilot needs data</CardTitle></CardHeader><CardContent className="text-muted-foreground">{error}</CardContent></Card>;
  if (!coach) return <div className="h-40 animate-pulse rounded-lg bg-muted" />;

  return (
    <div className="grid gap-6 pb-20">
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-md bg-primary text-primary-foreground"><Bot className="h-6 w-6" /></span>
        <div>
          <h1 className="text-3xl font-semibold">Cardio Pilot</h1>
          <p className="mt-1 text-muted-foreground">Coach output is generated from stored reports, meals, daily totals, and corrections.</p>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card><CardHeader><CardTitle>Today&apos;s cholesterol score</CardTitle></CardHeader><CardContent className="text-4xl font-semibold">{coach.todayScore}</CardContent></Card>
        <Card><CardHeader><CardTitle>Latest LDL</CardTitle></CardHeader><CardContent className="text-4xl font-semibold">{coach.currentLDL ?? "N/A"}</CardContent></Card>
        <Card><CardHeader><CardTitle>Fiber intake</CardTitle></CardHeader><CardContent className="text-lg font-medium">{coach.fiberStatus}</CardContent></Card>
      </div>
      <Section title="Foods Increasing Saturated Fat" items={coach.saturatedFatWatchlist.length ? coach.saturatedFatWatchlist : ["No saved meals yet."]} />
      <Section title="LDL-Friendly Suggestions" items={coach.suggestions} />
      <Section title="HDL Improvement Tips" items={coach.hdlTips} />
      <Section title="Weekly Summary" items={coach.weeklySummary} />
    </div>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return <Card><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent className="grid gap-2">{items.map((item) => <p key={item} className="rounded-md bg-muted p-3 text-sm">{item}</p>)}</CardContent></Card>;
}
