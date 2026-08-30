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
      // Multiple HTML entry points share the same SPA bundle. Retired routes use
      // one noindex shell so old links keep a clear answer without marketing the
      // closed products.
      input: {
        main: path.resolve(__dirname, "index.html"),
        retired: path.resolve(__dirname, "retired.html"),
        privacy: path.resolve(__dirname, "privacy.html"),
        terms: path.resolve(__dirname, "terms.html"),
        notFound: path.resolve(__dirname, "404.html"),
      },
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules/@radix-ui")) return "radix";
        },
      },
    },
  },
});
