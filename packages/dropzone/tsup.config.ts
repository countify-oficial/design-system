import { defineConfig } from "tsup";

// web: ESM e CJS, com o CSS em dist/index.css
export default defineConfig([
  { entry: { index: "src/index.ts" }, format: ["esm", "cjs"], dts: true, sourcemap: true, clean: true, treeshake: true, target: "es2022", loader: { ".css": "local-css" } },
]);
