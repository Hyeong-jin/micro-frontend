import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { federation } from "@module-federation/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "host",
      filename: "remoteEntry.js",
      remotes: {
        // AppPure: { type: "module", name: "AppPure", entry: "http://localhost:3001/remoteEntry.js" },
        // AppShadowDOM: { type: "module", name: "AppShadowDOM", entry: "http://localhost:3002/remoteEntry.js" },
        // AppWebComponents: { type: "module", name: "AppWebComponents", entry: "http://localhost:3003/remoteEntry.js" },
        AppPure: { type: "module", name: "AppPure", entry: "http://localhost:3001/mf-manifest.json" },
        AppShadowDOM: { type: "module", name: "AppShadowDOM", entry: "http://localhost:3002/mf-manifest.json" },
        AppWebComponents: { type: "module", name: "AppWebComponents", entry: "http://localhost:3003/mf-manifest.json" },
      },
      shared: {
        react: { singleton: true },
        "react/": { singleton: true },
        "react-dom": { singleton: true },
        "react-dom/": { singleton: true },
      },
      dts: true,
      dev: true,
    }),
  ],
  build: {
    target: "chrome89",
    cssCodeSplit: false,
    minify: false,
  },
  server: {
    port: 3000,
    strictPort: true,
  },
  preview: {
    port: 4000,
    strictPort: true,
  },
});
