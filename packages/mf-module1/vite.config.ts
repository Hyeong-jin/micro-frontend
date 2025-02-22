import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { NativeFederationTypeScriptRemote } from "@module-federation/native-federation-typescript/vite";
import { federation } from "@module-federation/vite";
import packageJSON from "./package.json";

const moduleFederationConfig = {
  name: "mf_module1",
  filename: "remoteEntry.js",
  manifest: true,
  exposes: {
    "./app": "./src/App",
  },
  shared: {
    ...packageJSON.dependencies,
    react: { version: "18.3.1", singleton: true },
    "react/": { version: "18.3.1", singleton: true },
    "react-dom": { version: "18.3.1", singleton: true },
    "react-dom/": { version: "18.3.1", singleton: true },
  },
};
export default defineConfig({
  plugins: [
    NativeFederationTypeScriptRemote({
      moduleFederationConfig,
    }),
    federation(moduleFederationConfig),
    react(),
  ],
  build: {
    target: "chrome89",
    lib: {
      entry: "src/App",
      formats: ["es"],
    },
  },
  server: {
    port: 3001,
    strictPort: true,
    origin: "http://localhost:3001",
    cors: true,
    proxy: {
      "/@mf-types.zip": {
        target: "http://localhost:3001",
        changeOrigin: true,
        rewrite: () => `/@fs/${process.cwd()}/dist/@mf-types.zip`,
      },
    },
    fs: {
      allow: ["./dist", "./src"],
    },
  },
  preview: {
    port: 3001,
    strictPort: true,
    cors: true,
  },
});
