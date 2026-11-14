import { describe, expect, it } from "vitest";
import { colors, createCssVariables, duration, nativeRaisedShadow, palette, primary, resolveSpacing, type ColorRole, type ColorScheme } from "../src/index.js";

// contraste WCAG: o guia pede 4,5:1 no texto
function contrast(a: string, b: string): number {
  const lum = (h: string) => {
    const [r = 0, g = 0, bl = 0] = [1, 3, 5].map((i) => {
      const x = parseInt(h.slice(i, i + 2), 16) / 255;
      return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [x = 0, y = 0] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

const schemes: ColorScheme[] = ["light", "dark"];

describe("cores", () => {
  it.each(schemes)("texto com 4,5:1 sobre os fundos no modo %s", (scheme) => {
    const c = colors[scheme];
    const textos: ColorRole[] = ["text", "text2", "text3", "label", "accent", "up", "down", "warn"];
    const fundos: ColorRole[] = ["bg", "card", "sheet", "field"];
    const pares: [ColorRole, ColorRole][] = [
      ...textos.flatMap((t) => fundos.map((f): [ColorRole, ColorRole] => [t, f])),
      ["onButton", "button"], ["bg", "down"], ["accent", "accentTint"], ["up", "upTint"], ["warn", "warnTint"], ["bg", "text"], ["label", "chip"],
    ];
    for (const [t, f] of pares) expect(contrast(c[t], c[f]), `${t} sobre ${f}`).toBeGreaterThanOrEqual(4.5);
  });

  it.each(schemes)("contorno de controle com 3:1 sobre os fundos no modo %s", (scheme) => {
    const c = colors[scheme];
    for (const f of ["bg", "card", "sheet", "field"] as const) expect(contrast(c.controlBorder, c[f]), `controlBorder sobre ${f}`).toBeGreaterThanOrEqual(3);
  });

  it("a cor principal é #225BA5 no claro e #8CBAF2 no escuro; o botão é #225BA5 nos dois", () => {
    expect(primary("light")).toBe("#225BA5");
    expect(primary("dark")).toBe("#8CBAF2");
    expect(colors.light.button).toBe("#225BA5");
    expect(colors.dark.button).toBe("#225BA5");
  });

  it.each(Object.keys(palette))("escala %s: 10 tons, do mais claro ao mais escuro", (nome) => {
    const tons = palette[nome as keyof typeof palette];
    expect(tons).toHaveLength(10);
    for (let i = 1; i < tons.length; i++) expect(contrast(tons[i] ?? "", "#FFFFFF")).toBeGreaterThan(contrast(tons[i - 1] ?? "", "#FFFFFF"));
  });
});

describe("variáveis CSS", () => {
  const css = createCssVariables();
  const bloco = (sel: string) => css.slice(css.indexOf(sel), css.indexOf("}", css.indexOf(sel)));

  it("cada papel aparece com o valor de cada modo", () => {
    for (const scheme of schemes) {
      const b = bloco(`[data-cf-color-scheme="${scheme}"]`);
      for (const [papel, hex] of Object.entries(colors[scheme])) {
        expect(b).toContain(`--cf-color-${papel.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}: ${hex};`);
      }
    }
  });

  it("não sai valor vazio", () => {
    expect(css).not.toMatch(/undefined|NaN|\[object/);
  });

  it("reduzir movimento zera todas as durações", () => {
    const reduz = css.slice(css.indexOf("prefers-reduced-motion"));
    for (const k of Object.keys(duration)) expect(reduz).toContain(`--cf-duration-${k}: 0ms;`);
  });
});

describe("React Native", () => {
  it("a sombra elevada vira props de sombra", () => {
    expect(nativeRaisedShadow("light")).toEqual({ shadowColor: "#182A42", shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.16, shadowRadius: 20, elevation: 16 });
    expect(nativeRaisedShadow("dark").shadowColor).toBe("#000000");
  });
});

describe("espaço", () => {
  it("resolveSpacing aceita tamanho, degrau da grade de 4 e 0", () => {
    expect([resolveSpacing("xs"), resolveSpacing("lg"), resolveSpacing(3), resolveSpacing(5), resolveSpacing(0)]).toEqual([4, 24, 12, 20, 0]);
  });
});
