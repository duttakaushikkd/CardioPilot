"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Activity, Camera, Gauge, LogIn, LogOut, Upload, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/upload", label: "Report", icon: Upload },
  { href: "/food", label: "Food Scan", icon: Camera }
];

export function Shell({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem("trackItUser");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.localStorage.removeItem("trackItUser");
    setUser(null);
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground">
              <Activity className="h-5 w-5" />
            </span>
            Track It
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            {user ? <span className="text-sm text-muted-foreground">{user.name}</span> : null}
            {user ? (
              <Button variant="outline" size="sm" onClick={logout}><LogOut className="h-4 w-4" /> Logout</Button>
            ) : (
              <>
                <Button asChild variant="outline" size="sm"><Link href="/signup"><UserPlus className="h-4 w-4" /> Sign up</Link></Button>
                <Button asChild size="sm"><Link href="/login"><LogIn className="h-4 w-4" /> Login</Link></Button>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t bg-background md:hidden">
        <Link href="/login" className="flex flex-col items-center gap-1 px-1 py-2 text-[11px] text-muted-foreground">
          <LogIn className="h-4 w-4" />
          Login
        </Link>
        <Link href="/signup" className="flex flex-col items-center gap-1 px-1 py-2 text-[11px] text-muted-foreground">
          <UserPlus className="h-4 w-4" />
          Sign up
        </Link>
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
