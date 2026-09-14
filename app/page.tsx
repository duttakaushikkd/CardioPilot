import Link from "next/link";
import { ArrowRight, Camera, FileHeart, LineChart, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="grid gap-8 pb-20">
      <section className="grid min-h-[72vh] items-center gap-8 py-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="inline-flex rounded-md bg-muted px-3 py-1 text-sm text-muted-foreground">Food and cholesterol tracker</div>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-normal sm:text-6xl">Track It</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Login, scan food photos for nutrition and minerals, upload lipid reports, and see whether bad cholesterol is reducing.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/login">
                Login <LogIn className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">
                Open Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/food">Scan Food</Link>
            </Button>
          </div>
        </div>
        <div className="grid gap-3">
          {[
            { icon: Camera, title: "Scan food", body: "See calories, macros, fiber, sodium, potassium, calcium, iron, magnesium, and cholesterol." },
            { icon: FileHeart, title: "Upload reports", body: "Store LDL, HDL, triglycerides, VLDL, and total cholesterol history." },
            { icon: LineChart, title: "Understand LDL", body: "Track It clearly shows whether bad cholesterol is reducing or increasing." }
          ].map((item) => (
            <Card key={item.title}>
              <CardHeader className="flex-row items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
                  <item.icon className="h-5 w-5" />
                </span>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{item.body}</CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
