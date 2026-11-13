// Grava dist/tokens.css a partir do JS que o tsup acabou de gerar, e dist/fonts.css com a Roboto do pacote
// (funciona sem internet e com CSP fechado, como no Electron).
import { cpSync, writeFileSync } from "node:fs";
import { createCssVariables, fontWeight } from "../dist/index.js";

const css = createCssVariables();
writeFileSync(new URL("../dist/tokens.css", import.meta.url), css);
console.log(`dist/tokens.css: ${(css.length / 1024).toFixed(1)} KB`);

cpSync(new URL("../fonts/", import.meta.url), new URL("../dist/fonts/", import.meta.url), { recursive: true });
const fontes = Object.values(fontWeight)
  .map((w) => `@font-face { font-family: Roboto; font-style: normal; font-weight: ${w}; font-display: swap; src: url("./fonts/roboto-latin-${w}-normal.woff2") format("woff2"); }`)
  .join("\n");
writeFileSync(new URL("../dist/fonts.css", import.meta.url), `/* Roboto (OFL, fonts/OFL.txt): ${Object.values(fontWeight).join(", ")} */\n${fontes}\n`);
