import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    if (import.meta.env.DEV) {
      console.error("ErrorBoundary caught:", error, info);
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
          <div className="max-w-md w-full text-center space-y-4">
            <h1 className="text-3xl font-bold text-psychedelic">Something broke.</h1>
            <p className="text-muted-foreground">
              The page hit an error. A refresh usually clears it. If it keeps happening, email{" "}
              <a href="mailto:alex@avahealth.co" className="text-primary hover:underline">
                alex@avahealth.co
              </a>
              .
            </p>
            <div className="flex gap-2 justify-center pt-2">
              <Button onClick={() => window.location.reload()}>Refresh</Button>
              <Button variant="outline" onClick={() => { window.location.href = "/"; }}>
                Go home
              </Button>
            </div>
            {import.meta.env.DEV && (
              <pre className="text-xs text-left bg-card p-3 rounded border overflow-auto max-h-40 mt-4">
                {this.state.error.message}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
