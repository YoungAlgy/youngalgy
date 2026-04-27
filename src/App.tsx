import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import { Loader2 } from "lucide-react";

// Lazy-load both Index AND SupabaseAuthGate so the public landing
// (which most visitors hit) doesn't pay the ~70KB gzip cost of
// @supabase/auth-ui-react. The auth bundle only loads when someone
// actually visits /dashboard.
const Index = lazy(() => import("./pages/Index"));
const SupabaseAuthGate = lazy(() =>
  import("./components/SupabaseAuthGate").then((m) => ({ default: m.SupabaseAuthGate }))
);

const DashboardFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="Loading dashboard" />
  </div>
);

const App = () => (
  <ErrorBoundary>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/dashboard"
            element={
              <Suspense fallback={<DashboardFallback />}>
                <SupabaseAuthGate>
                  <Index />
                </SupabaseAuthGate>
              </Suspense>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Analytics />
    </TooltipProvider>
  </ErrorBoundary>
);

export default App;
