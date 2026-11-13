// Regras comuns a todos os pacotes: as recomendadas do ESLint e as estritas do typescript-eslint, com tipos.
// As de React (hooks e acessibilidade) entram quando o primeiro pacote React chegar.
import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
  { ignores: ["dist/**", "coverage/**"] },
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  {
    languageOptions: { parserOptions: { projectService: true } },
    // número dentro de template string é seguro (é o caso de "16px")
    rules: { "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }] },
  },
  {
    // scripts de build e configs rodam no Node, sem checagem de tipos
    files: ["**/*.js", "**/*.mjs"],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: { globals: globals.node },
  },
);
