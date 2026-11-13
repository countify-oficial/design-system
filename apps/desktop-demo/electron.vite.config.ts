import react from "@vitejs/plugin-react";
import { defineConfig } from "electron-vite";

// processo principal e preload em .ts; renderer em .tsx. O preload sai em CommonJS: com sandbox, o Electron não carrega ESM nele.
export default defineConfig({
  main: { build: { outDir: "dist/main" } },
  preload: { build: { outDir: "dist/preload", rolldownOptions: { output: { format: "cjs", entryFileNames: "[name].cjs" } } } },
  renderer: { plugins: [react()], build: { outDir: "dist/renderer" } },
});
