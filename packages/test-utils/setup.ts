// Preparação do jsdom para os testes da web (a mesma do core).
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(cleanup);

if (typeof window !== "undefined") {
  (Element.prototype as Partial<Element>).scrollIntoView ??= () => undefined;
  // o jsdom não tem ResizeObserver: este avisa uma vez, ao começar a observar
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
