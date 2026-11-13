// Pacotes de React Native: as regras comuns e as dos hooks do React. Sem jsx-a11y, que é do DOM; a acessibilidade
// do celular (accessibilityRole, Label, State) é conferida nos testes.
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";
import base from "./index.js";

export default defineConfig(base, reactHooks.configs.flat.recommended);
