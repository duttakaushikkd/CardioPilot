"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UploadReportPage() {
  const [result, setResult] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const saved = window.localStorage.getItem("trackItUser");
    if (saved) form.set("userId", JSON.parse(saved).id);
    const res = await fetch("/api/report/upload", { method: "POST", body: form });
    const body = await res.json();
    setLoading(false);
    if (!res.ok) return setMessage(body.error || "Upload failed");
    setResult(body.report);
  }

  return (
    <div className="grid max-w-3xl gap-6 pb-20">
      <div>
        <h1 className="text-3xl font-semibold">Upload Lipid Report</h1>
        <p className="mt-2 text-muted-foreground">Images are extracted by OpenAI Vision and stored as lipid history.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Report file</CardTitle></CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={onSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="report">PDF or image</Label>
              <Input id="report" name="report" type="file" accept="image/*,.pdf" required />
            </div>
            <Button disabled={loading}>
              <Upload className="h-4 w-4" />
              {loading ? "Extracting..." : "Extract and Save"}
            </Button>
          </form>
          {message ? <p className="mt-4 rounded-md bg-amber-100 p-3 text-sm text-amber-900">{message}</p> : null}
        </CardContent>
      </Card>
      {result ? (
        <Card>
          <CardHeader><CardTitle>Extracted values</CardTitle></CardHeader>
          <CardContent className="grid gap-2 text-sm">
            {["reportDate", "labName", "totalCholesterol", "LDL", "HDL", "triglycerides", "VLDL", "nonHDL"].map((key) => <div key={key} className="flex justify-between border-b py-2"><span>{key}</span><strong>{String(result[key] ?? "N/A")}</strong></div>)}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
