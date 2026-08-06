import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";

// Public legal pages — reachable by anyone (footer links + direct URLs).
// Lazy so the landing bundle stays lean.
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
// Public freelance / "work with me" page — healthcare-data pipeline lead-gen.
const Freelance = lazy(() => import("./pages/Freelance"));
// Public CreditKit product page — the Next.js/Supabase/Stripe starter Algy sells.
const CreditKit = lazy(() => import("./pages/CreditKit"));
// Public BaseLens project page — the x402/Base/AI agent tool.
const BaseLens = lazy(() => import("./pages/BaseLens"));
// Public ApplyKit product page — the Gemini resume-tailoring tool. Links out
// to the live app (applykit-beryl.vercel.app), same pattern as CreditKit.
const ApplyKit = lazy(() => import("./pages/ApplyKit"));

const PageFallback = () => (
  <div className="min-h-screen" aria-hidden />
);

const App = () => (
  <ErrorBoundary>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/privacy"
            element={
              <Suspense fallback={<PageFallback />}>
                <Privacy />
              </Suspense>
            }
          />
          <Route
            path="/terms"
            element={
              <Suspense fallback={<PageFallback />}>
                <Terms />
              </Suspense>
            }
          />
          <Route
            path="/freelance"
            element={
              <Suspense fallback={<PageFallback />}>
                <Freelance />
              </Suspense>
            }
          />
          <Route
            path="/creditkit"
            element={
              <Suspense fallback={<PageFallback />}>
                <CreditKit />
              </Suspense>
            }
          />
          <Route
            path="/baselens"
            element={
              <Suspense fallback={<PageFallback />}>
                <BaseLens />
              </Suspense>
            }
          />
          <Route
            path="/applykit"
            element={
              <Suspense fallback={<PageFallback />}>
                <ApplyKit />
              </Suspense>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </ErrorBoundary>
);

export default App;
