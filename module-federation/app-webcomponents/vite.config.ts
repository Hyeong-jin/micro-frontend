import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dts from "vite-plugin-dts";
import { federation } from "@module-federation/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      outDir: "./dist/types",
      insertTypesEntry: true,
      tsconfigPath: "./tsconfig.app.json",
      exclude: ["./stories", "./tests", "./src/main.tsx"],
    }),
    federation({
      name: "AppWebcomponents",
      filename: "remoteEntry.js",
      manifest: true,
      exposes: {
        "./App": "./src/App",
        "./Header": "./src/components/Header",
        "./Button": "./src/components/Button",
        "./Page": "./src/pages/Page",
      },
      shared: { 
        react: { singleton: true }, 
        "react/": { singleton: true }, 
        "react-dom": { singleton: true }, 
        "react-dom/": { singleton: true }, 
        "ui": { singleton: true },
      },
    }),
  ],
  build: {
    target: "chrome89",
  },
  server: {
    port: 3003,
    strictPort: true,
  },
  preview: {
    port: 4003,
    strictPort: true,
  },
});
