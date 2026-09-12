import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  return (
    <div className="grid max-w-3xl gap-6 pb-20">
      <div>
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="mt-2 text-muted-foreground">Deployment configuration and profile defaults for the demo user.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Environment</CardTitle></CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label>OPENAI_API_KEY</Label>
            <Input value="Configured on the server" readOnly />
          </div>
          <div className="grid gap-2">
            <Label>MONGODB_URI</Label>
            <Input value="Configured on the server" readOnly />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Data model</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Lipid reports are stored in <strong>lipid_reports</strong>. Meals preserve <strong>aiPrediction</strong>, <strong>userCorrected</strong>, and <strong>correctionMade</strong> for future learning.
        </CardContent>
      </Card>
    </div>
  );
}
