import { cleanup } from "@testing-library/react";
import { axe } from "jest-axe";
import { afterEach, expect } from "vitest";

afterEach(cleanup);

// o jsdom não tem matchMedia; nos testes, nenhuma media query vale (cada teste troca se precisar).
// O css.test.ts roda no Node, sem window.
if (typeof window !== "undefined") {
  window.matchMedia = (query: string) =>
    ({ matches: false, media: query, onchange: null, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false }) as unknown as MediaQueryList;
}

/** Acessibilidade pelo axe-core: nenhuma violação no que foi desenhado. */
export async function semViolacoes(container: Element) {
  expect((await axe(container)).violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
}
