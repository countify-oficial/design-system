import countify from "@countify-oficial/eslint-config";
import { defineConfig } from "eslint/config";

export default defineConfig(countify, { languageOptions: { parserOptions: { tsconfigRootDir: import.meta.dirname } } });
