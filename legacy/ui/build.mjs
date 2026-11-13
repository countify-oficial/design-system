// Monta dist/countify.css: variáveis do tokens.ts + classes de ícone + css/*.css, nesta ordem.
// O JS e os tipos do dist/ vêm do tsc (npm run build faz os dois).
// node build.mjs           grava o arquivo
// node build.mjs --check   só confere se o dist está em dia (o teste usa)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { colors, radius, size, fontSize, font } from "./tokens.ts";
import { icons } from "./icons.ts";

const ORDEM = ["base", "layout", "actions", "inputs", "data", "overlays", "states"];
const SAIDA = new URL("./dist/countify.css", import.meta.url);
const kebab = (s) => s.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
const vars = (obj, prefixo = "", unidade = "") => Object.entries(obj).map(([k, v]) => `--cf-${prefixo}${kebab(k)}: ${v}${unidade};`).join(" ");

export function build() {
  const claro = vars(colors.light), escuro = vars(colors.dark);
  const medidas = [vars(radius, "radius-", "px"), vars(size, "size-", "px"), vars(fontSize, "font-size-", "px"), `--cf-font: ${font.web};`].join(" ");
  const temas = [
    `:root { ${claro} ${medidas} color-scheme: light; }`,
    `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { ${escuro} color-scheme: dark; } }`,
    `[data-theme="dark"] { ${escuro} color-scheme: dark; color: var(--cf-text); }`,
    `[data-theme="light"] { ${claro} color-scheme: light; color: var(--cf-text); }`,
  ].join("\n");
  const svg = (corpo) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22" fill="none" stroke="black" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${corpo}</svg>`;
  const iconCss = Object.entries(icons).map(([nome, corpo]) => `.cf-icon-${nome} { --cf-i: url("data:image/svg+xml,${encodeURIComponent(svg(corpo))}"); }`).join("\n");
  const partes = ORDEM.map((n) => readFileSync(new URL(`./css/${n}.css`, import.meta.url), "utf8"));
  const versao = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8")).version;
  return [`/*! @countify/ui ${versao} · gerado por build.mjs a partir de tokens.ts, icons.ts e css/ — não edite à mão */`, temas, ...partes, iconCss].join("\n\n") + "\n";
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const css = build();
  if (process.argv.includes("--check")) {
    let atual = "";
    try { atual = readFileSync(SAIDA, "utf8"); } catch {}
    if (atual !== css) { console.error("dist/countify.css está desatualizado: rode npm run build"); process.exit(1); }
    console.log("dist em dia");
  } else {
    mkdirSync(new URL("./dist/", import.meta.url), { recursive: true });
    writeFileSync(SAIDA, css);
    console.log(`dist/countify.css: ${(css.length / 1024).toFixed(1)} KB`);
  }
}
