import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Anchor, Blockquote, List, Typography } from "../src";
import { semViolacoes } from "./setup";

describe("Blockquote, List, Anchor e Typography", () => {
  it("Blockquote com autor", async () => {
    const { container } = render(<Blockquote cite="— Ana, gerente">O painel mudou a reunião de segunda.</Blockquote>);
    expect(container.querySelector("blockquote cite")?.textContent).toBe("— Ana, gerente");
    expect((container.firstElementChild as HTMLElement).style.getPropertyValue("--tone-c")).toBe("var(--cf-color-accent)");
    await semViolacoes(container);
  });

  it("List: ul por padrão, ol numerada, ícone do List ou do item", async () => {
    const { container } = render(
      <>
        <List><List.Item>Um</List.Item></List>
        <List type="ordered" spacing="md" icon="•"><List.Item>Dois</List.Item><List.Item icon="✓">Três</List.Item></List>
      </>,
    );
    expect(container.querySelector("ul")?.style.getPropertyValue("--list-spacing")).toBe("var(--cf-spacing-xs)");
    const ol = container.querySelector("ol");
    expect(ol?.hasAttribute("data-with-icon")).toBe(true);
    expect(Array.from(ol?.querySelectorAll("li") ?? []).map((li) => li.firstElementChild?.textContent)).toEqual(["•", "✓"]);
    await semViolacoes(container);
  });

  it("Anchor: link na cor de destaque que herda a letra", async () => {
    const { container } = render(<p>Veja as <Anchor href="/analises">análises</Anchor></p>);
    const a = screen.getByRole("link", { name: "análises" });
    expect(a.style.getPropertyValue("--text-color")).toBe("var(--cf-color-accent)");
    expect([a.dataset["underline"], a.hasAttribute("data-inherit")]).toEqual(["hover", true]);
    await semViolacoes(container);
  });

  it("Anchor como botão: <button type=button> com a classe do link (o CSS tira o visual do navegador)", async () => {
    const abrir = vi.fn();
    const { container } = render(<p>Sem conta? <Anchor component="button" type="button" onClick={abrir}>Criar conta</Anchor></p>);
    const b = screen.getByRole("button", { name: "Criar conta" });
    expect([b.tagName, b.getAttribute("type"), b.dataset["underline"]]).toEqual(["BUTTON", "button", "hover"]);
    expect(b.className).toMatch(/root/);
    b.click();
    expect(abrir).toHaveBeenCalledOnce();
    await semViolacoes(container);
  });

  it("Typography envolve HTML comum", () => {
    render(<Typography><h2>Ajuda</h2><p>Texto</p></Typography>);
    expect(screen.getByRole("heading", { name: "Ajuda" }).parentElement?.className).toMatch(/root/);
  });
});
