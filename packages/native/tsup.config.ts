import { defineConfig } from "tsup";

// só React Native: o Metro lê ESM
export default defineConfig({
  entry: { index: "src/index.ts" }, format: ["esm"], dts: true, sourcemap: true, clean: true, treeshake: true, target: "es2022",
});
