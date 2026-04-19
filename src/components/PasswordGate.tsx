import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lock } from "lucide-react";

const STORAGE_KEY = "ya_dashboard_auth";
const PASSWORD = "toggle813";
const EXPIRY_MS = 24 * 60 * 60 * 1000; // 24h

interface PasswordGateProps {
  children: React.ReactNode;
}

interface AuthRecord {
  expiresAt: number;
}

function readAuth(): AuthRecord | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  // Legacy "true" value should be treated as expired so the gate reappears.
  if (raw === "true") return null;
  try {
    const parsed = JSON.parse(raw) as AuthRecord;
    if (typeof parsed?.expiresAt !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function PasswordGate({ children }: PasswordGateProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const auth = readAuth();
    if (auth && auth.expiresAt > Date.now()) {
      setAuthenticated(true);
    } else if (auth) {
      // expired
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASSWORD) {
      const record: AuthRecord = { expiresAt: Date.now() + EXPIRY_MS };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
      setAuthenticated(true);
    } else {
      setError(true);
    }
  };

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
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            className={error ? "border-destructive" : ""}
            autoFocus
          />
          {error && <p className="text-sm text-destructive">Incorrect password</p>}
          <Button type="submit" className="w-full">Unlock</Button>
        </form>
        <p className="text-xs text-muted-foreground">Session lasts 24 hours.</p>
      </Card>
    </div>
  );
}
