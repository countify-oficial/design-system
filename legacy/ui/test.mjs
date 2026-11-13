// node --test (npm test compila antes): o CSS em dia, os dois lados com os mesmos componentes, ícones da vitrine, contraste e as regras do lib.
// Props e ícones dos componentes o tsc confere: os dois lados usam os tipos do types.ts.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { build } from "./build.mjs";
import { colors } from "./dist/tokens.js";
import { icons } from "./dist/icons.js";
import { contrast, selectAllState, toggleAll, monthGrid, rangeRole, nextRange, formatTime, pageLabel, selectSummary, mix } from "./dist/lib.js";
import { lineChart, niceMax } from "./dist/charts.js";

const ler = (f) => readFileSync(new URL(f, import.meta.url), "utf8");
const exportados = (src) => new Set([...src.matchAll(/export (?:function|const) (\w+)/g)].map((m) => m[1]));

test("dist/countify.css está em dia com tokens, ícones e css/", () => {
  assert.equal(ler("./dist/countify.css"), build(), "rode npm run build");
});

test("web e celular exportam os mesmos componentes", () => {
  const web = exportados(ler("./react/index.tsx")), nativo = exportados(ler("./native/index.tsx"));
  const SO_NATIVO = new Set(["useColors"]);
  assert.deepEqual([...web].sort(), [...nativo].filter((n) => !SO_NATIVO.has(n)).sort());
});

test("todo ícone da vitrine existe", () => {
  const usados = [...ler("./docs/index.html").matchAll(/cf-icon cf-icon-([a-z-]+)/g)].map((m) => m[1]);
  for (const n of usados) assert.ok(icons[n], `docs/index.html: ícone ${n} não existe`);
});

test("contraste: texto 4,5:1 nos dois modos", () => {
  for (const [modo, c] of Object.entries(colors)) {
    const pares = [
      ...["text", "text2", "text3", "label", "accent", "up", "down"].flatMap((t) => ["bg", "card", "sheet", "field"].map((f) => [t, f])),
      ["onButton", "button"], ["bg", "down"], ["accent", "accentTint"], ["up", "upTint"], ["bg", "text"], ["label", "chip"],
    ];
    for (const [t, f] of pares) assert.ok(contrast(c[t], c[f]) >= 4.5, `${modo}: ${t} sobre ${f} = ${contrast(c[t], c[f]).toFixed(2)}`);
  }
});

test("Selecionar todos respeita os bloqueados", () => {
  const itens = [{ id: "a" }, { id: "b" }, { id: "c", disabled: true }];
  assert.equal(selectAllState(itens, []), "none");
  assert.equal(selectAllState(itens, ["a"]), "some");
  assert.equal(selectAllState(itens, ["a", "b"]), "all");
  assert.deepEqual(toggleAll(itens, ["a"]), ["a", "b"]);
  assert.deepEqual(toggleAll(itens, ["a", "b", "c"]), ["c"]);
});

test("calendário: novembro de 2026 começa no domingo, período e toques", () => {
  const g = monthGrid(2026, 10);
  assert.equal(g[0][0].getDate(), 1);
  assert.equal(g.length, 5);
  assert.ok(g.every((s) => s.length === 7));
  const d = (n) => new Date(2026, 10, n);
  assert.equal(rangeRole(d(1), d(1), d(10)), "start");
  assert.equal(rangeRole(d(5), d(1), d(10)), "in");
  assert.equal(rangeRole(d(10), d(1), d(10)), "end");
  assert.equal(rangeRole(d(3), d(3), null), "single");
  assert.deepEqual(nextRange({ start: d(5), end: null }, d(8)), { start: d(5), end: d(8) });
  assert.deepEqual(nextRange({ start: d(5), end: null }, d(2)), { start: d(2), end: null });
  assert.deepEqual(nextRange({ start: d(5), end: d(8) }, d(9)), { start: d(9), end: null });
});

test("campos e textos", () => {
  assert.equal(formatTime("8"), "08");
  assert.equal(formatTime("1"), "1");
  assert.equal(formatTime("830"), "08:30");
  assert.equal(formatTime("18:3a0"), "18:30");
  assert.equal(formatTime("08:3"), "08:3", "apagar não embaralha");
  assert.equal(formatTime("08:"), "08");
  assert.equal(formatTime("23:599"), "23:59");
  assert.equal(pageLabel(2, 50, 312), "51–100 de 312");
  assert.equal(pageLabel(7, 50, 312), "301–312 de 312");
  const ops = [{ value: "a", label: "Lume" }, { value: "b", label: "Brisa" }, { value: "c", label: "Farol" }];
  assert.equal(selectSummary(ops, "b"), "Brisa");
  assert.equal(selectSummary(ops, ["a", "b", "c"], true), "Todos");
  assert.equal(selectSummary(ops, ["a", "c"], true), "Lume, Farol");
  assert.equal(mix("#000000", "#FFFFFF", 0.5), "#808080");
});

test("gráfico: escala redonda e texto escapado", () => {
  assert.equal(niceMax(42), 50);
  assert.equal(niceMax(180), 200);
  const { svg } = lineChart({ labels: ["<b>", "9h"], actual: [1, 2] }, { width: 300, palette: colors.light, native: true });
  assert.ok(svg.includes("&lt;b&gt;") && !svg.includes("<b>"));
  assert.ok(!svg.includes("NaN"));
});
