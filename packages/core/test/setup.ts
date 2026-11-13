import { cleanup } from "@testing-library/react";
import { axe } from "jest-axe";
import { afterEach, expect } from "vitest";

afterEach(cleanup);

// o jsdom não tem matchMedia; nos testes, nenhuma media query vale (cada teste troca se precisar).
// O css.test.ts roda no Node, sem window.
if (typeof window !== "undefined") {
  // o jsdom também não tem ResizeObserver: este avisa uma vez, ao começar a observar
  // o tipo diz que sempre existe; no jsdom não existe
  (window as Partial<Window & typeof globalThis>).ResizeObserver ??= class {
    constructor(private readonly avisar: ResizeObserverCallback) {}
    observe(alvo: Element) {
      this.avisar([{ target: alvo } as ResizeObserverEntry], this);
    }
    unobserve() {}
    disconnect() {}
  };
  window.matchMedia = (query: string) =>
    ({ matches: false, media: query, onchange: null, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false }) as unknown as MediaQueryList;
}

/** Acessibilidade pelo axe-core: nenhuma violação no que foi desenhado. */
export async function semViolacoes(container: Element) {
  expect((await axe(container)).violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
}
