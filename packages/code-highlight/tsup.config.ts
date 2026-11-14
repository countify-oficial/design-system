import { defineConfig } from "tsup";

// web: ESM e CJS, com o CSS em dist/index.css; React Native: dist/index.native.js (o Metro escolhe pela condição "react-native")
// O que é só do celular fica fora do pacote: não está em peerDependencies (só em peerDependenciesMeta, ver o README).
const doCelular = ["react-native", "react-native-svg", "@countify-oficial/native"];

export default defineConfig([
  { entry: { index: "src/index.ts" }, format: ["esm", "cjs"], dts: true, sourcemap: true, clean: true, treeshake: true, target: "es2022", loader: { ".css": "local-css" } },
  { entry: { "index.native": "src/index.native.ts" }, format: ["esm"], dts: true, sourcemap: true, treeshake: true, target: "es2022", external: doCelular },
]);
