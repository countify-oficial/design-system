import { defineConfig } from "tsup";

// duas saídas: a da web (ESM e CJS) e a do React Native (o Metro escolhe pela condição "react-native")
export default defineConfig([
  { entry: { index: "src/index.ts" }, format: ["esm", "cjs"], dts: true, sourcemap: true, clean: true, treeshake: true, target: "es2022" },
  // o React Native é do app (o Metro resolve): fica de fora do pacote mesmo sem estar nas peerDependencies
  { entry: { "index.native": "src/index.native.ts" }, format: ["esm"], dts: true, sourcemap: true, treeshake: true, target: "es2022", external: ["react-native", "expo-clipboard"] },
]);
