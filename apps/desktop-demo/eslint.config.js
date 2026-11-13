import countify from "@countify-oficial/eslint-config/react";
import { defineConfig } from "eslint/config";

export default defineConfig({ ignores: ["dist"] }, countify, { languageOptions: { parserOptions: { tsconfigRootDir: import.meta.dirname } } });
