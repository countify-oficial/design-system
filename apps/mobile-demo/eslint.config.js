import countify from "@countify-oficial/eslint-config/native";
import { defineConfig } from "eslint/config";

export default defineConfig({ ignores: ["dist", ".expo", "*.cjs"] }, countify, { languageOptions: { parserOptions: { tsconfigRootDir: import.meta.dirname } } });
