// Gera o dist a partir dos SVGs de assets/icons/tabler/ (que ficam como vieram do Tabler):
// - dist/<variante>/<nome>.js: o miolo do <svg> de um ícone;
// - dist/index.js (web): um import() por ícone, e o bundler do app faz um pedaço por ícone, baixado só quando usado;
// - dist/index.native.js (React Native): um require() por ícone, que o Metro empacota e só executa quando usado;
// - os .d.ts, com os nomes em união de literais.
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { innerMarkup } from "./svg.mjs";

const src = new URL("../assets/icons/tabler/", import.meta.url);
const dist = new URL("../dist/", import.meta.url);
const variants = ["outline", "filled"];

rmSync(dist, { recursive: true, force: true });
const names = {};
for (const variant of variants) {
  mkdirSync(new URL(`${variant}/`, dist), { recursive: true });
  names[variant] = readdirSync(new URL(`${variant}/`, src)).filter((f) => f.endsWith(".svg")).map((f) => f.slice(0, -".svg".length)).sort();
  for (const name of names[variant]) {
    const svg = readFileSync(new URL(`${variant}/${name}.svg`, src), "utf8");
    writeFileSync(new URL(`${variant}/${name}.js`, dist), `export default ${JSON.stringify(innerMarkup(svg, `${variant}/${name}`))};\n`);
  }
}

const q = JSON.stringify;
const map = (load) => variants.map((v) => `export const ${v} = {\n${names[v].map((n) => `  ${q(n)}: () => ${load(`./${v}/${n}.js`)},`).join("\n")}\n};\n`).join("");
writeFileSync(new URL("index.js", dist), map((path) => `import(${q(path)})`));
writeFileSync(new URL("index.native.js", dist), map((path) => `require(${q(path)}).default`));

const types = (loader) =>
  `export declare const outline: Record<TablerIconName, () => ${loader}>;\nexport declare const filled: Record<TablerFilledIconName, () => ${loader}>;\n`;
writeFileSync(
  new URL("index.d.ts", dist),
  `/** Nome de um ícone do Tabler (variante outline, que tem todos). */\nexport type TablerIconName = ${names.outline.map(q).join(" | ")};\n` +
    `/** Nome de um ícone do Tabler que também tem a variante filled. */\nexport type TablerFilledIconName = ${names.filled.map(q).join(" | ")};\n` +
    types("Promise<{ default: string }>"),
);
writeFileSync(
  new URL("index.native.d.ts", dist),
  `import type { TablerFilledIconName, TablerIconName } from "./index.js";\nexport type { TablerFilledIconName, TablerIconName };\n${types("string")}`,
);
console.log(`ícones do Tabler: ${names.outline.length} outline, ${names.filled.length} filled`);
