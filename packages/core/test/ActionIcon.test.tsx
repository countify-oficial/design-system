import { CountifyProvider } from "@countify-oficial/provider";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ActionIcon, CloseButton, Icon } from "../src";
import { semViolacoes } from "./setup";

describe("ActionIcon e CloseButton", () => {
  it("ActionIcon: quadrado de 44 (sm), cor do texto, com nome", async () => {
    const { container } = render(<ActionIcon aria-label="Editar painel" variant="default"><Icon name="edit" /></ActionIcon>);
    const b = screen.getByRole("button", { name: "Editar painel" });
    expect(b.style.getPropertyValue("--ai-size")).toBe("var(--cf-button-height-sm)");
    expect(b.style.getPropertyValue("--ai-color")).toBe("var(--cf-color-text)");
    expect(b.dataset["variant"]).toBe("default");
    await semViolacoes(container);
  });

  it("loading troca o ícone pelo girador e desliga", () => {
    render(<ActionIcon aria-label="Salvar" loading><Icon name="bookmark" /></ActionIcon>);
    const b = screen.getByRole("button", { name: "Salvar" });
    expect(b.hasAttribute("disabled")).toBe(true);
    expect(b.querySelector("svg")).toBeNull();
  });

  it("CloseButton: nome 'Fechar' do provider, ou o passado", async () => {
    const { container } = render(<CountifyProvider messages={{ close: "Close" }}><CloseButton /><CloseButton aria-label="Fechar aviso" /></CountifyProvider>);
    expect(screen.getByRole("button", { name: "Close" }).querySelector("svg")).not.toBeNull();
    expect(screen.getByRole("button", { name: "Fechar aviso" })).toBeTruthy();
    await semViolacoes(container);
  });
});
