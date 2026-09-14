import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="mx-auto grid max-w-3xl gap-6 pb-20">
      <div>
        <h1 className="text-3xl font-semibold">Terms and Conditions</h1>
        <p className="mt-2 text-muted-foreground">Version 2026-09-14</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Use of Track It</CardTitle></CardHeader>
        <CardContent className="grid gap-4 text-sm text-muted-foreground">
          <p>Track It provides AI-assisted nutrition estimates and cholesterol trend tracking for informational purposes only.</p>
          <p>Track It is not medical advice, diagnosis, or treatment. Users should consult a qualified healthcare professional before making health, medication, or diet decisions.</p>
          <p>Food Scan results are estimates generated from images and may be incomplete or inaccurate. Lipid report extraction may also require user review if a report is unclear.</p>
          <p>By creating an account, users agree that their uploaded lipid report values may be stored to render their cholesterol dashboard and trend graph. Food Scan photos and nutrition results are not stored.</p>
          <p>Users are responsible for uploading only their own data or data they are authorized to use.</p>
        </CardContent>
      </Card>
    </div>
  );
}
