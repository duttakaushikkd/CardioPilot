"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MetricCard } from "@/components/metric-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Dashboard = {
  latest?: { LDL?: number; HDL?: number; totalCholesterol?: number };
  reports: Array<{ reportDate: string; LDL: number; HDL: number }>;
  daily: Array<{ date: string; calories: number; saturatedFat: number; fiber: number; healthScore: number }>;
  meals: Array<{ mealType: string }>;
  averages: { calories: number; saturatedFat: number; healthScore: number };
  insights: string[];
};

export default function DashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem("trackItUser");
    const userId = saved ? JSON.parse(saved).id : "demo-user";
    fetch(`/api/dashboard?userId=${encodeURIComponent(userId)}`)
      .then((res) => res.ok ? res.json() : res.json().then((body) => Promise.reject(body)))
      .then(setData)
      .catch((err) => setError(err.error || "Connect MongoDB to load dashboard data."));
  }, []);

  if (error) return <EmptyState title="Dashboard needs data" body={error} />;
  if (!data) return <div className="grid gap-4 sm:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />)}</div>;

  const latestReport = data.reports.at(-1);
  const previousReport = data.reports.at(-2);
  const ldlChange = latestReport && previousReport ? latestReport.LDL - previousReport.LDL : null;
  const ldlStatus = ldlChange === null
    ? { title: "Upload another report to see LDL movement", tone: "bg-muted text-foreground", detail: "Track It compares your latest LDL with the previous report." }
    : ldlChange < 0
      ? { title: "Bad cholesterol is reducing", tone: "bg-emerald-100 text-emerald-900", detail: `LDL is down by ${Math.abs(ldlChange)} mg/dL since your previous report.` }
      : ldlChange > 0
        ? { title: "Bad cholesterol has increased", tone: "bg-red-100 text-red-900", detail: `LDL is up by ${ldlChange} mg/dL since your previous report.` }
        : { title: "Bad cholesterol is unchanged", tone: "bg-amber-100 text-amber-900", detail: "LDL is the same as your previous report." };

  return (
    <div className="grid gap-6 pb-20">
      <div>
        <h1 className="text-3xl font-semibold">Cholesterol Dashboard</h1>
        <p className="mt-2 text-muted-foreground">A simple view of whether LDL, the bad cholesterol number, is improving.</p>
      </div>
      <Card className={ldlStatus.tone}>
        <CardHeader><CardTitle>{ldlStatus.title}</CardTitle></CardHeader>
        <CardContent className="grid gap-3">
          <p>{ldlStatus.detail}</p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline"><Link href="/upload">Upload Report</Link></Button>
            <Button asChild><Link href="/food">Scan Food</Link></Button>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="LDL (bad cholesterol)" value={data.latest?.LDL ?? "N/A"} helper="Lower is better" />
        <MetricCard label="HDL (good cholesterol)" value={data.latest?.HDL ?? "N/A"} helper="Higher is better" />
        <MetricCard label="Avg saturated fat" value={`${data.averages.saturatedFat} g`} helper="Lower supports LDL control" />
        <MetricCard label="Avg fiber" value={`${averageFiber(data.daily)} g`} helper="Higher supports LDL control" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Is LDL going down?"><ResponsiveContainer width="100%" height={260}><LineChart data={data.reports}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="reportDate" hide /><YAxis /><Tooltip /><Line dataKey="LDL" stroke="#dc2626" strokeWidth={3} /></LineChart></ResponsiveContainer></ChartCard>
        <ChartCard title="Good cholesterol trend"><ResponsiveContainer width="100%" height={260}><LineChart data={data.reports}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="reportDate" hide /><YAxis /><Tooltip /><Line dataKey="HDL" stroke="#059669" strokeWidth={3} /></LineChart></ResponsiveContainer></ChartCard>
        <ChartCard title="Daily saturated fat"><ResponsiveContainer width="100%" height={260}><AreaChart data={data.daily}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" hide /><YAxis /><Tooltip /><Area dataKey="saturatedFat" fill="#f59e0b" stroke="#d97706" /></AreaChart></ResponsiveContainer></ChartCard>
        <ChartCard title="Daily calories"><ResponsiveContainer width="100%" height={260}><BarChart data={data.daily}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" hide /><YAxis /><Tooltip /><Bar dataKey="calories" fill="#0f766e" /></BarChart></ResponsiveContainer></ChartCard>
      </div>
      <Card>
        <CardHeader><CardTitle>AI Insights</CardTitle></CardHeader>
        <CardContent className="grid gap-3">{data.insights.map((insight) => <p key={insight} className="rounded-md bg-muted p-3 text-sm">{insight}</p>)}</CardContent>
      </Card>
    </div>
  );
}

function averageFiber(daily: Dashboard["daily"]) {
  if (!daily.length) return 0;
  const total = daily.reduce((sum, day: any) => sum + (day.fiber || 0), 0);
  return Number((total / daily.length).toFixed(1));
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <Card><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent>{children}</CardContent></Card>;
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return <Card><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent className="text-muted-foreground">{body}</CardContent></Card>;
}
