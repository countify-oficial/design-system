// @vitest-environment node
import { breakpoints } from "@countify-oficial/tokens";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// Valor visual só nos tokens: o CSS dos componentes usa as variáveis --cf-*. As exceções são as media queries
// (que não aceitam variável e repetem tokens.breakpoints) e o 1px da técnica do VisuallyHidden.
const src = fileURLToPath(new URL("../src/", import.meta.url));
const arquivos = readdirSync(src, { recursive: true, encoding: "utf8" }).filter((f) => f.endsWith(".module.css"));

describe("CSS dos componentes", () => {
  it.each(arquivos)("%s só usa valores dos tokens", (arquivo) => {
    const css = readFileSync(src + arquivo, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    const quebras = [...css.matchAll(/@media \(min-width: (\d+)px\)/g)].map((m) => Number(m[1]));
    for (const q of quebras) expect(Object.values(breakpoints)).toContain(q);
    const permitidos = new Set([...quebras.map((q) => `${q}px`), ...(arquivo.includes("VisuallyHidden") ? ["1px", "-1px"] : [])]);
    expect([...css.matchAll(/-?\d*\.?\d+px/g)].map((m) => m[0]).filter((px) => !permitidos.has(px))).toEqual([]);
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(css).not.toMatch(/\b\d*\.?\d+m?s\b/);
    expect(css).not.toMatch(/font-family:(?!\s*var\(--cf-)/);
  });
});
