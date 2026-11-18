import { describe, expect, it } from "vitest";
import { defaultMessages, groupByDay } from "../src/index";

describe("groupByDay", () => {
  const now = new Date(2026, 10, 18, 12, 0);
  const avisos = [
    { id: "a", d: new Date(2026, 10, 18, 10, 40) },
    { id: "b", d: new Date(2026, 10, 18, 0, 5) },
    { id: "c", d: new Date(2026, 10, 17, 23, 59) },
    { id: "d", d: new Date(2026, 10, 12, 9, 0) },
    { id: "e", d: new Date(2025, 11, 31, 9, 0) },
  ];

  it("hoje, ontem e a data por extenso (com o ano só se for de outro ano), na ordem em que chegam", () => {
    const grupos = groupByDay(avisos, (a) => a.d, { now, today: defaultMessages.today, yesterday: defaultMessages.yesterday });
    expect(grupos.map((g) => [g.label, g.items.map((a) => a.id)])).toEqual([
      ["hoje", ["a", "b"]],
      ["ontem", ["c"]],
      ["12 de novembro", ["d"]],
      ["31 de dezembro de 2025", ["e"]],
    ]);
    expect(grupos[0]?.key).toBe("2026-11-18");
  });

  it("textos do novo dia e outro idioma", () => {
    const grupos = groupByDay(avisos.slice(2, 4), (a) => a.d, { now, locale: "en-US", yesterday: "Yesterday" });
    expect(grupos.map((g) => g.label)).toEqual(["Yesterday", "November 12"]);
  });

  it("textos novos da lista de avisos", () => {
    expect([defaultMessages.yesterday, defaultMessages.unread, defaultMessages.noNotifications]).toEqual(["ontem", "não lido", "Nenhum aviso"]);
  });
});
