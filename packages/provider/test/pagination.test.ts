import { describe, expect, it } from "vitest";
import { pageLabel, paginationRange } from "../src/index";

describe("paginação", () => {
  it("poucas páginas: todas", () => {
    expect(paginationRange(5, 3)).toEqual([1, 2, 3, 4, 5]);
    expect(paginationRange(7, 1)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("saltos com dots, sempre o mesmo número de casas", () => {
    expect(paginationRange(10, 1)).toEqual([1, 2, 3, 4, 5, "dots", 10]);
    expect(paginationRange(10, 5)).toEqual([1, "dots", 4, 5, 6, "dots", 10]);
    expect(paginationRange(10, 10)).toEqual([1, "dots", 6, 7, 8, 9, 10]);
    expect(paginationRange(20, 10, 2, 2)).toEqual([1, 2, "dots", 8, 9, 10, 11, 12, "dots", 19, 20]);
  });

  it("rótulo dos itens", () => {
    expect(pageLabel(2, 20, 340)).toBe("21–40 de 340");
    expect(pageLabel(17, 20, 340)).toBe("321–340 de 340");
    expect(pageLabel(1, 20, 0)).toBe("0 de 0");
  });
});
