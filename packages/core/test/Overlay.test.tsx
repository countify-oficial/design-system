import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ActionBar, Affix, Button, Dialog, LoadingOverlay, Overlay } from "../src";
import { semViolacoes } from "./setup";

describe("Overlay, LoadingOverlay, Dialog, Affix e ActionBar", () => {
  it("Overlay: véu absoluto ou fixo, camada dos tokens", () => {
    render(<><Overlay data-testid="a" /><Overlay data-testid="b" fixed center backgroundOpacity={0.4} zIndex="max" /></>);
    expect(screen.getByTestId("a").style.getPropertyValue("--overlay-z")).toBe("var(--cf-z-overlay)");
    const b = screen.getByTestId("b");
    expect([b.hasAttribute("data-fixed"), b.style.getPropertyValue("--overlay-opacity"), b.style.getPropertyValue("--overlay-z")]).toEqual([true, "0.4", "var(--cf-z-max)"]);
  });

  it("LoadingOverlay: véu ocupado com o girador", () => {
    const { rerender } = render(<div style={{ position: "relative" }}><LoadingOverlay visible /></div>);
    expect(screen.getByRole("status", { name: "Carregando" }).parentElement?.getAttribute("aria-busy")).toBe("true");
    rerender(<div style={{ position: "relative" }}><LoadingOverlay visible={false} /></div>);
  });

  it("Dialog: caixa fixa no canto, sem véu", async () => {
    const { baseElement } = render(<Dialog opened withCloseButton aria-label="Nova versão">Há uma versão nova.</Dialog>);
    const d = screen.getByRole("dialog", { name: "Nova versão" });
    expect(d.dataset["position"]).toBe("bottom-right");
    expect(d.getAttribute("aria-modal")).toBeNull();
    await semViolacoes(baseElement);
  });

  it("Affix e ActionBar", () => {
    render(<><Affix data-testid="f"><Button>Topo</Button></Affix><ActionBar opened aria-label="Ações das lojas">3 lojas<Button size="sm">Mover</Button></ActionBar></>);
    const f = screen.getByTestId("f");
    expect([f.style.getPropertyValue("--affix-bottom"), f.style.getPropertyValue("--affix-right")]).toEqual(["var(--cf-spacing-lg)", "var(--cf-spacing-lg)"]);
    expect(screen.getByRole("toolbar", { name: "Ações das lojas" }).textContent).toContain("3 lojas");
  });
});
