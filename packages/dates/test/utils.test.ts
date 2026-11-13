import { describe, expect, it } from "vitest";
import { addMonths, formatDate, monthGrid, monthLabel, nextRange, parseDate, parseTime, rangeRole, weekdays } from "../src/utils";

describe("contas de datas", () => {
  it("grade do mês de domingo a sábado", () => {
    const nov = monthGrid(2026, 10);
    expect(nov[0]?.map((d) => d?.getDate() ?? null)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    const fev = monthGrid(2026, 1);
    expect(fev.flat().filter(Boolean)).toHaveLength(28);
    expect(fev[0]?.[0]?.getDate()).toBe(1); // 1/2/2026 é domingo
    expect(monthGrid(2026, 4)[0]?.slice(0, 5)).toEqual([null, null, null, null, null]); // 1/5/2026 é sexta
  });

  it("mês seguinte sem pular (31/01 → 28/02)", () => {
    expect(addMonths(new Date(2026, 0, 31), 1).getDate()).toBe(28);
  });

  it("período: começa, fecha, recomeça", () => {
    const a = new Date(2026, 10, 3);
    const b = new Date(2026, 10, 9);
    let r = nextRange([null, null], b);
    r = nextRange(r, a);
    expect(r).toEqual([a, null]);
    r = nextRange(r, b);
    expect(r).toEqual([a, b]);
    expect(rangeRole(new Date(2026, 10, 5), r)).toBe("in");
    expect(rangeRole(a, r)).toBe("start");
    expect(rangeRole(b, [b, null])).toBe("single");
  });

  it("formatos em pt-BR", () => {
    expect(monthLabel(new Date(2026, 10, 13))).toBe("Novembro de 2026");
    expect(formatDate(new Date(2026, 10, 3))).toBe("03/11/2026");
    expect(weekdays().map((w) => w.short).join("")).toBe("DSTQQSS");
    expect(parseDate("31/02/2026")).toBeNull();
    expect(parseDate("3/11/26")?.getFullYear()).toBe(2026);
    expect(parseTime("805")).toEqual({ h: 8, m: 5 });
    expect(parseTime("24:00")).toBeNull();
  });
});
