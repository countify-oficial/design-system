import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { innerMarkup } from "../scripts/svg.mjs";

const tabler = new URL("../assets/icons/tabler/", import.meta.url);
const manifest = JSON.parse(readFileSync(new URL("manifest.json", tabler), "utf8"));

describe("assets do Tabler", () => {
  it("o manifesto lista exatamente os SVGs de cada variante, com a versão do pacote", () => {
    expect(manifest).toMatchObject({ package: "@tabler/icons", license: "MIT", version: expect.stringMatching(/^\d+\.\d+\.\d+$/) });
    for (const variant of ["outline", "filled"]) {
      const files = readdirSync(new URL(`${variant}/`, tabler)).sort();
      const listed = manifest.icons.filter((i) => i.variant === variant);
      expect(listed.map((i) => i.path.slice(variant.length + 1)).sort()).toEqual(files);
      expect(listed.every((i) => i.path === `${variant}/${i.name}.svg`)).toBe(true);
    }
  });

  it("traz o LICENSE do Tabler com o aviso de copyright", () => {
    const license = readFileSync(new URL("LICENSE", tabler), "utf8");
    expect(license).toMatch(/^MIT License/);
    expect(license).toMatch(/^Copyright \(c\) .+ Paweł Kuna$/m);
  });
});

describe("innerMarkup", () => {
  it("tira o miolo do SVG numa linha, sem mudar os atributos", () => {
    const svg = readFileSync(new URL("outline/home.svg", tabler), "utf8");
    expect(innerMarkup(svg, "home")).toBe(
      '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l-2 0l9 -9l9 9l-2 0" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" /><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />',
    );
  });

  it("recusa script, evento, link e estilo, que entrariam na página pelo innerHTML", () => {
    for (const inner of ['<script>alert(1)</script>', '<path d="M0 0" onload="alert(1)" />', '<a href="https://x"><path d="M0 0" /></a>', '<path style="fill:red" d="M0 0" />', '<image href="x.png" />']) {
      expect(() => innerMarkup(`<svg viewBox="0 0 24 24">${inner}</svg>`, "x")).toThrow(/fora do formato/);
    }
  });
});
