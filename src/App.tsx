import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import RetiredPage from "./pages/RetiredPage";

// Public legal pages — reachable by anyone (footer links + direct URLs).
// Lazy so the landing bundle stays lean.
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const AlgyHouseHome = lazy(() => import("./pages/AlgyHouseHome"));

const PageFallback = () => (
  <div className="min-h-screen" aria-hidden />
);

const App = () => (
  <ErrorBoundary>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Suspense fallback={<div style={{ position: "fixed", inset: 0, background: "#120b1d" }} />}><AlgyHouseHome /></Suspense>} />
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
          <Route path="/freelance" element={<RetiredPage />} />
          <Route path="/creditkit" element={<RetiredPage />} />
          <Route path="/baselens" element={<RetiredPage />} />
          <Route path="/applykit" element={<RetiredPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </ErrorBoundary>
);

export default App;
