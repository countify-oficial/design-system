// Pacotes React: as regras comuns, mais as dos hooks do React e as de acessibilidade (jsx-a11y).
// jsx-a11y vale para os elementos do DOM; os arquivos .native.* (React Native) ficam de fora.
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";
import base from "./index.js";

export default defineConfig(
  base,
  reactHooks.configs.flat.recommended,
  { files: ["**/*.tsx"], ignores: ["**/*.native.tsx"], extends: [jsxA11y.flatConfigs.recommended] },
);
