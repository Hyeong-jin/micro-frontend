import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dts from "vite-plugin-dts";
import tsconfigpaths from "vite-tsconfig-paths";

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
    tsconfigpaths(),
  ],

  build: {
    manifest: true,
    lib: {
      entry: "src/index.ts",
      name: "UiLib",
      formats: ["es", "cjs", "umd"],
      fileName: (format) => `ui-lib.${format}.js`,
      cssFileName: "ui-lib",
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
