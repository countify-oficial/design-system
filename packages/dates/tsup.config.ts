import { defineConfig } from "tsup";

// web: ESM e CJS, com o CSS em dist/index.css; React Native: dist/index.native.js (o Metro escolhe pela condição "react-native")
export default defineConfig([
  { entry: { index: "src/index.ts" }, format: ["esm", "cjs"], dts: true, sourcemap: true, clean: true, treeshake: true, target: "es2022", loader: { ".css": "local-css" } },
  { entry: { "index.native": "src/index.native.ts" }, format: ["esm"], dts: true, sourcemap: true, treeshake: true, target: "es2022" },
]);
