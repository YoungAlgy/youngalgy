import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SupabaseAuthGate } from "@/components/SupabaseAuthGate";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import { Loader2 } from "lucide-react";

const Index = lazy(() => import("./pages/Index"));

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
              <SupabaseAuthGate>
                <Suspense fallback={<DashboardFallback />}>
                  <Index />
                </Suspense>
              </SupabaseAuthGate>
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
