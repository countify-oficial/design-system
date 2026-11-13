// Grava dist/tokens.css a partir do JS que o tsup acabou de gerar.
import { writeFileSync } from "node:fs";
import { createCssVariables } from "../dist/index.js";

const css = createCssVariables();
writeFileSync(new URL("../dist/tokens.css", import.meta.url), css);
console.log(`dist/tokens.css: ${(css.length / 1024).toFixed(1)} KB`);
