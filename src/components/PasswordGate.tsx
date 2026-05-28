import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lock, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

/**
 * Cosmetic-but-RLS-backed password gate for /dashboard.
 *
 * UX: type a passcode (toggle813), click Unlock, you're in. No email, no magic link.
 *
 * Implementation: the typed passcode is the actual Supabase Auth password for a
 * fixed dashboard identity (`dashboard@youngalgy.local`). On Unlock we call
 * `supabase.auth.signInWithPassword(...)`. Success sets a real session in
 * localStorage, which `auth.uid()` checks pass — so the 2026-04-26 RLS lockdown
 * stays in force and `select * from opportunities` actually returns rows.
 *
 * Why this over magic-link: the user wanted the original PasswordGate UX back.
 * Why this over re-opening anon SELECT: that would weaken RLS on shared
 * production infra; this preserves the lockdown without sacrificing UX.
 */

const DASHBOARD_EMAIL = "dashboard@youngalgy.local";

interface PasswordGateProps {
  children: React.ReactNode;
}

export function PasswordGate({ children }: PasswordGateProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Swap the favicon to the legacy pink/skull mark as soon as the
  // /dashboard route mounts (before auth) so the tab icon matches the
  // dashboard's psychedelic theme. Restored on unmount.
  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    const apple = document.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]');
    const prev = link?.href ?? "/boat.svg";
    const prevApple = apple?.href ?? "/boat.svg";
    if (link) link.href = "/logo.svg";
    if (apple) apple.href = "/logo.svg";
    return () => {
      if (link) link.href = prev;
      if (apple) apple.href = prevApple;
    };
  }, []);

  // On mount: do we already have a valid Supabase session? Skip the gate if so.
  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession()
      .then(({ data }) => {
        if (cancelled) return;
        if (data.session) setAuthenticated(true);
      })
      .catch(() => { /* network error — show login form */ })
      .finally(() => { if (!cancelled) setCheckingSession(false); });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (cancelled) return;
      setAuthenticated(!!newSession);
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || submitting) return;
    setSubmitting(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: DASHBOARD_EMAIL,
      password,
    });
    setSubmitting(false);
    if (signInError) {
      setError("Incorrect password");
      setPassword("");
      return;
    }
    setAuthenticated(true);
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="Checking session" />
      </div>
    );
  }

  if (authenticated) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-sm p-8 space-y-6 text-center border bg-card">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Lock className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Dashboard Access</h2>
          <p className="text-sm text-muted-foreground mt-1">Enter the password to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <label htmlFor="dashboard-password" className="sr-only">Password</label>
          <Input
            id="dashboard-password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(null); }}
            className={error ? "border-destructive" : ""}
            autoFocus
            disabled={submitting}
            aria-invalid={!!error || undefined}
            aria-describedby={error ? "password-error" : undefined}
          />
          {error && <p id="password-error" className="text-sm text-destructive" role="alert">{error}</p>}
          <Button type="submit" className="w-full" disabled={!password || submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-label="Signing in" /> : "Unlock"}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground">Sessions persist for ~7 days.</p>
        <nav className="flex items-center justify-center gap-3 text-[11px] text-muted-foreground/80">
          <a href="/privacy" className="hover:text-foreground underline-offset-4 hover:underline transition-colors">Privacy</a>
          <span aria-hidden>·</span>
          <a href="/terms" className="hover:text-foreground underline-offset-4 hover:underline transition-colors">Terms</a>
          <span aria-hidden>·</span>
          <a href="/" className="hover:text-foreground underline-offset-4 hover:underline transition-colors">Home</a>
        </nav>
      </Card>
    </div>
  );
}
