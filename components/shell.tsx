import Link from "next/link";
import { Activity, Apple, Bot, ChartNoAxesCombined, Gauge, Settings, Upload } from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/upload", label: "Report", icon: Upload },
  { href: "/meal", label: "Add Meal", icon: Apple },
  { href: "/progress", label: "Progress", icon: ChartNoAxesCombined },
  { href: "/coach", label: "Coach", icon: Bot },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground">
              <Activity className="h-5 w-5" />
            </span>
            Cardio Pilot
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-6 border-t bg-background md:hidden">
        {nav.map((item) => (
          <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 px-1 py-2 text-[11px] text-muted-foreground">
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
