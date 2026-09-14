"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MetricCard } from "@/components/metric-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Dashboard = {
  latest?: { LDL?: number; HDL?: number; totalCholesterol?: number };
  previous?: { LDL?: number; HDL?: number; totalCholesterol?: number };
  reports: Array<{ reportDate: string; LDL: number; HDL: number }>;
  ldlChange: number | null;
  direction: "decreasing" | "increasing" | "unchanged" | "not_enough_data";
  generatedAt: string | null;
  firstReportDate: string | null;
  latestReportDate: string | null;
  reportCount: number;
  insights: string[];
};

export default function DashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.ok ? res.json() : res.json().then((body) => Promise.reject(body)))
      .then(setData)
      .catch((err) => setError(err.error || "Login to load your cholesterol dashboard."));
  }, []);

  if (error) return <EmptyState title="Login required" body={error} />;
  if (!data) return <div className="grid gap-4 sm:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />)}</div>;

  const ldlStatus = data.ldlChange === null
    ? { title: "Upload another report to see LDL movement", tone: "bg-muted text-foreground", detail: "Track It compares your latest LDL with the previous report." }
    : data.ldlChange < 0
      ? { title: "Bad cholesterol is reducing", tone: "bg-emerald-100 text-emerald-900", detail: `LDL is down by ${Math.abs(data.ldlChange)} mg/dL since your previous report.` }
      : data.ldlChange > 0
        ? { title: "Bad cholesterol has increased", tone: "bg-red-100 text-red-900", detail: `LDL is up by ${data.ldlChange} mg/dL since your previous report.` }
        : { title: "Bad cholesterol is unchanged", tone: "bg-amber-100 text-amber-900", detail: "LDL is the same as your previous report." };

  return (
    <div className="grid gap-6 pb-20">
      <div>
        <h1 className="text-3xl font-semibold">Cholesterol Dashboard</h1>
        <p className="mt-2 text-muted-foreground">A simple view of whether LDL, the bad cholesterol number, is improving from stored lipid reports.</p>
      </div>
      <Card className={ldlStatus.tone}>
        <CardHeader><CardTitle>{ldlStatus.title}</CardTitle></CardHeader>
        <CardContent className="grid gap-3">
          <p>{ldlStatus.detail}</p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline"><Link href="/upload">Upload Report</Link></Button>
            <Button asChild><Link href="/food">Analyze Food</Link></Button>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="LDL (bad cholesterol)" value={data.latest?.LDL ?? "N/A"} helper="Lower is better" />
        <MetricCard label="LDL change" value={data.ldlChange === null ? "N/A" : `${data.ldlChange > 0 ? "+" : ""}${data.ldlChange}`} helper="Compared with previous report" />
        <MetricCard label="HDL (good cholesterol)" value={data.latest?.HDL ?? "N/A"} helper="Higher is better" />
        <MetricCard label="Reports in graph" value={data.reportCount} helper={data.firstReportDate ? `Since ${new Date(data.firstReportDate).toLocaleDateString()}` : "Upload reports to begin"} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Is LDL going down?"><ResponsiveContainer width="100%" height={260}><LineChart data={data.reports}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="reportDate" hide /><YAxis /><Tooltip /><Line dataKey="LDL" stroke="#dc2626" strokeWidth={3} /></LineChart></ResponsiveContainer></ChartCard>
        <ChartCard title="Good cholesterol trend"><ResponsiveContainer width="100%" height={260}><LineChart data={data.reports}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="reportDate" hide /><YAxis /><Tooltip /><Line dataKey="HDL" stroke="#059669" strokeWidth={3} /></LineChart></ResponsiveContainer></ChartCard>
      </div>
      <Card>
        <CardHeader><CardTitle>Report Insights</CardTitle></CardHeader>
        <CardContent className="grid gap-3">{data.insights.map((insight) => <p key={insight} className="rounded-md bg-muted p-3 text-sm">{insight}</p>)}</CardContent>
      </Card>
      <p className="text-sm text-muted-foreground">
        Food Scan results are temporary. This dashboard is rendered from persistent graph data generated from every stored lipid report{data.generatedAt ? `, last updated ${new Date(data.generatedAt).toLocaleString()}` : ""}.
      </p>
    </div>
  );
}


function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <Card><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent>{children}</CardContent></Card>;
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="grid gap-4 text-muted-foreground">
        <p>{body}</p>
        <Button asChild className="w-fit"><Link href="/login">Login</Link></Button>
      </CardContent>
    </Card>
  );
}
