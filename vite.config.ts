import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: { overlay: false },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  build: {
    rollupOptions: {
      // Multiple HTML entry points that share the same SPA bundle. index.html is
      // the default; creditkit.html / applykit.html / baselens.html are prerendered
      // OG shells (real static meta for link-preview scrapers) that still boot the
      // React app.
      input: {
        main: path.resolve(__dirname, "index.html"),
        creditkit: path.resolve(__dirname, "creditkit.html"),
        applykit: path.resolve(__dirname, "applykit.html"),
        baselens: path.resolve(__dirname, "baselens.html"),
      },
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules/recharts")) return "recharts";
          if (id.includes("node_modules/@hello-pangea")) return "dnd";
          if (id.includes("node_modules/@radix-ui")) return "radix";
        },
      },
    },
  },
});
