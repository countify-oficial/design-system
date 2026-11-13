/// <reference path="./jest-axe.d.ts" />
import { configureAxe } from "jest-axe";
import { expect } from "vitest";

// As mesmas regras do core: as guardas de foco do Floating UI não têm nome, e os landmarks são da página.
const axe = configureAxe({
  rules: { region: { enabled: false } },
  globalOptions: { rules: [{ id: "aria-command-name", selector: '[role="link"], [role="button"]:not([data-floating-ui-focus-guard]), [role="menuitem"]' }] },
});

/** Acessibilidade pelo axe-core: nenhuma violação no que foi desenhado. */
export async function semViolacoes(container: Element) {
  expect((await axe(container)).violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
}
