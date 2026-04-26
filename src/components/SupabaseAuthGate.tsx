import { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Lock, Loader2 } from "lucide-react";

/**
 * Real Supabase magic-link auth gate for `/dashboard`.
 *
 * Replaces the cosmetic PasswordGate (which was localStorage-only and didn't
 * actually gate the data — Supabase RLS was anon-readable). After this is in
 * place AND the SQL migration in `supabase/migrations/20260426_lockdown_rls.sql`
 * is applied, the dashboard data is gated at the data layer:
 *
 *  - anon `select` from opportunities/interviews returns `[]`
 *  - only `authenticated` users (session.user.id != null) can read
 *  - Algy signs in once via a magic link to youngalgy@gmail.com, session
 *    persists in localStorage for ~7 days
 */
export function SupabaseAuthGate({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. read existing session from localStorage on first paint
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // 2. subscribe to auth state changes (sign-in via magic link, sign-out, refresh)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="Checking session" />
      </div>
    );
  }

  if (session) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-sm p-8 space-y-6 border bg-card">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Dashboard Access</h2>
          <p className="text-sm text-muted-foreground">
            I&apos;ll email you a magic link to sign in
          </p>
        </div>
        <Auth
          supabaseClient={supabase}
          providers={[]}
          view="magic_link"
          showLinks={false}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: "hsl(328 90% 62%)",
                  brandAccent: "hsl(328 90% 70%)",
                  brandButtonText: "white",
                  defaultButtonBackground: "hsl(272 30% 14%)",
                  defaultButtonBackgroundHover: "hsl(272 30% 18%)",
                  inputBackground: "hsl(272 30% 14%)",
                  inputBorder: "hsl(272 30% 22%)",
                  inputBorderHover: "hsl(328 90% 62%)",
                  inputBorderFocus: "hsl(328 90% 62%)",
                  inputText: "hsl(280 20% 95%)",
                  inputLabelText: "hsl(280 15% 65%)",
                  inputPlaceholder: "hsl(280 15% 50%)",
                  messageText: "hsl(280 15% 65%)",
                  messageTextDanger: "hsl(0 80% 60%)",
                  anchorTextColor: "hsl(328 90% 62%)",
                  anchorTextHoverColor: "hsl(328 90% 75%)",
                  dividerBackground: "hsl(272 30% 18%)",
                },
                radii: {
                  borderRadiusButton: "0.5rem",
                  buttonBorderRadius: "0.5rem",
                  inputBorderRadius: "0.5rem",
                },
              },
            },
          }}
          redirectTo={
            typeof window !== "undefined" ? `${window.location.origin}/dashboard` : undefined
          }
          localization={{
            variables: {
              magic_link: {
                email_input_label: "Email",
                email_input_placeholder: "you@example.com",
                button_label: "Send magic link",
                loading_button_label: "Sending...",
                confirmation_text: "Check your email for the magic link",
              },
            },
          }}
        />
        <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
          Sign-in is restricted. Magic links only land in inboxes you own.
        </p>
      </Card>
    </div>
  );
}
