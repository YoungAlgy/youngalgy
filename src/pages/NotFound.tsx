import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => (
  <div className="min-h-screen bg-background flex items-center justify-center p-6">
    <div className="max-w-md w-full text-center space-y-6">
      <p className="text-sm font-semibold text-primary uppercase tracking-widest">404</p>
      <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-psychedelic">
        Lost the thread.
      </h1>
      <p className="text-muted-foreground text-base">
        That page doesn&apos;t exist — or it moved and the link hasn&apos;t caught up.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <Button asChild className="gap-2">
          <a href="/"><Home className="h-4 w-4" /> Home</a>
        </Button>
        <Button asChild variant="outline" className="gap-2 border-primary/40">
          <a href="javascript:history.back()"><ArrowLeft className="h-4 w-4" /> Go back</a>
        </Button>
      </div>
    </div>
  </div>
);

export default NotFound;
