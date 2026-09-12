"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MetricCard } from "@/components/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Dashboard = {
  latest?: { LDL?: number; HDL?: number; totalCholesterol?: number };
  reports: Array<{ reportDate: string; LDL: number; HDL: number }>;
  daily: Array<{ date: string; calories: number; saturatedFat: number; healthScore: number }>;
  meals: Array<{ mealType: string }>;
  averages: { calories: number; saturatedFat: number; healthScore: number };
  insights: string[];
};

export default function DashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.ok ? res.json() : res.json().then((body) => Promise.reject(body)))
      .then(setData)
      .catch((err) => setError(err.error || "Connect MongoDB to load dashboard data."));
  }, []);

  if (error) return <EmptyState title="Dashboard needs data" body={error} />;
  if (!data) return <div className="grid gap-4 sm:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />)}</div>;

  const pie = Object.entries(data.meals.reduce<Record<string, number>>((acc, meal) => {
    acc[meal.mealType] = (acc[meal.mealType] || 0) + 1;
    return acc;
  }, {})).map(([name, value]) => ({ name, value }));

  return (
    <div className="grid gap-6 pb-20">
      <div>
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Your latest lipid numbers, nutrition trends, and database-backed AI insights.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard label="Current LDL" value={data.latest?.LDL ?? "N/A"} helper="mg/dL" />
        <MetricCard label="HDL" value={data.latest?.HDL ?? "N/A"} helper="mg/dL" />
        <MetricCard label="Total Cholesterol" value={data.latest?.totalCholesterol ?? "N/A"} helper="mg/dL" />
        <MetricCard label="Avg Daily Calories" value={data.averages.calories} />
        <MetricCard label="Avg Saturated Fat" value={`${data.averages.saturatedFat} g`} />
        <MetricCard label="Health Score" value={data.averages.healthScore} helper="/ 100" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="LDL Trend"><ResponsiveContainer width="100%" height={260}><LineChart data={data.reports}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="reportDate" hide /><YAxis /><Tooltip /><Line dataKey="LDL" stroke="#dc2626" strokeWidth={2} /></LineChart></ResponsiveContainer></ChartCard>
        <ChartCard title="HDL Trend"><ResponsiveContainer width="100%" height={260}><LineChart data={data.reports}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="reportDate" hide /><YAxis /><Tooltip /><Line dataKey="HDL" stroke="#059669" strokeWidth={2} /></LineChart></ResponsiveContainer></ChartCard>
        <ChartCard title="Calories by Day"><ResponsiveContainer width="100%" height={260}><BarChart data={data.daily}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" hide /><YAxis /><Tooltip /><Bar dataKey="calories" fill="#0f766e" /></BarChart></ResponsiveContainer></ChartCard>
        <ChartCard title="Saturated Fat Trend"><ResponsiveContainer width="100%" height={260}><AreaChart data={data.daily}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" hide /><YAxis /><Tooltip /><Area dataKey="saturatedFat" fill="#f59e0b" stroke="#d97706" /></AreaChart></ResponsiveContainer></ChartCard>
        <ChartCard title="Weekly Health Score"><ResponsiveContainer width="100%" height={260}><LineChart data={data.daily}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" hide /><YAxis /><Tooltip /><Line dataKey="healthScore" stroke="#2563eb" strokeWidth={2} /></LineChart></ResponsiveContainer></ChartCard>
        <ChartCard title="Meal Distribution"><ResponsiveContainer width="100%" height={260}><PieChart><Pie data={pie} dataKey="value" nameKey="name" outerRadius={90} label>{pie.map((_, i) => <Cell key={i} fill={["#047857", "#f59e0b", "#2563eb", "#dc2626"][i % 4]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></ChartCard>
      </div>
      <Card>
        <CardHeader><CardTitle>AI Insights</CardTitle></CardHeader>
        <CardContent className="grid gap-3">{data.insights.map((insight) => <p key={insight} className="rounded-md bg-muted p-3 text-sm">{insight}</p>)}</CardContent>
      </Card>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <Card><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent>{children}</CardContent></Card>;
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return <Card><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent className="text-muted-foreground">{body}</CardContent></Card>;
}
