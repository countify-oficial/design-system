import { defineConfig } from "tsup";

// Os .module.css viram classes locais (loader local-css do esbuild) e saem juntos em dist/index.css, que o app
// importa uma vez: import "@countify-oficial/core/styles.css". O loader vai em ".css" porque o plugin de CSS do tsup
// só repassa esse; todo CSS do core é módulo (um global precisaria de :global).
export default defineConfig({
  entry: { index: "src/index.ts" },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  target: "es2022",
  loader: { ".css": "local-css" },
});
