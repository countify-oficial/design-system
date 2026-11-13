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
    rules: {
      // número dentro de template string é seguro (é o caso de "16px")
      "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],
      // () => setX(1) é o jeito comum de escrever um callback
      "@typescript-eslint/no-confusing-void-expression": ["error", { ignoreArrowShorthand: true }],
      // _nome: parâmetro que existe para manter a mesma assinatura nas duas plataformas
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  {
    // scripts de build e configs rodam no Node, sem checagem de tipos
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: { globals: globals.node },
  },
);
