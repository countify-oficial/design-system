import { describe, expect, it } from "vitest";
import { createSpotlightStore, filterActions } from "../src/store";

const acoes = [
  { id: "1", label: "Análises", keywords: ["vendas"] },
  { id: "2", label: "Lume Jardins", group: "Lojas" },
  { id: "3", label: "Lume Orla", group: "Lojas", description: "Fortaleza" },
];

describe("spotlight", () => {
  it("busca sem acento, por palavras-chave, grupo e descrição", () => {
    expect(filterActions(acoes, "analises").map((a) => a.id)).toEqual(["1"]);
    expect(filterActions(acoes, "vendas").map((a) => a.id)).toEqual(["1"]);
    expect(filterActions(acoes, "lojas fortaleza").map((a) => a.id)).toEqual(["3"]);
    expect(filterActions(acoes, "", 2)).toHaveLength(2);
  });

  it("abre, fecha e alterna", () => {
    const s = createSpotlightStore();
    s.toggle();
    expect(s.getState()).toBe(true);
    s.close();
    expect(s.getState()).toBe(false);
  });
});
