import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button, Icon } from "../src";
import { semViolacoes } from "./setup";

const v = (el: HTMLElement, n: string) => el.style.getPropertyValue(n);

describe("Button", () => {
  it("filled accent; md no celular e sm a partir de 768", async () => {
    const { container } = render(<Button>Salvar</Button>);
    const b = screen.getByRole("button", { name: "Salvar" });
    expect(b.getAttribute("type")).toBe("button");
    expect([b.dataset["variant"], b.dataset["color"]]).toEqual(["filled", "accent"]);
    expect([v(b, "--button-height"), v(b, "--button-height-sm"), v(b, "--button-px-sm"), v(b, "--button-fz-sm")])
      .toEqual(["var(--cf-button-height-md)", "var(--cf-button-height-sm)", "var(--cf-control-padding-x-sm)", "var(--cf-control-font-size-sm)"]);
    expect(v(b, "--button-radius")).toBe("var(--cf-radius-sm)");
    await semViolacoes(container);
  });

  it("variante, cor, tamanho fixo, largura toda e seções", () => {
    render(<Button variant="subtle" color="down" size="lg" fullWidth leftSection={<Icon name="trash" />} rightSection="→">Excluir análise</Button>);
    const b = screen.getByRole("button", { name: /Excluir análise/ });
    expect([b.dataset["variant"], b.dataset["color"]]).toEqual(["subtle", "down"]);
    expect([v(b, "--button-height"), v(b, "--button-height-sm")]).toEqual(["var(--cf-button-height-lg)", ""]);
    expect(b.hasAttribute("data-full-width")).toBe(true);
    expect(b.querySelector("svg")).not.toBeNull();
  });

  it("loading: girador decorativo no lugar do ícone, aria-busy e não clica", () => {
    const aoClicar = vi.fn();
    render(<Button loading leftSection={<Icon name="plus" />} onClick={aoClicar}>Salvar</Button>);
    const b = screen.getByRole("button", { name: "Salvar" });
    expect(b.getAttribute("aria-busy")).toBe("true");
    expect(b.hasAttribute("disabled")).toBe(true);
    expect(b.hasAttribute("data-loading")).toBe(true);
    expect(b.querySelector("svg")).toBeNull();
    expect(b.querySelector('[aria-hidden="true"]')).not.toBeNull();
    fireEvent.click(b);
    expect(aoClicar).not.toHaveBeenCalled();
  });

  it("como link (component='a')", () => {
    render(<Button component="a" href="/nova" variant="dashed">+ Adicionar bloco</Button>);
    expect(screen.getByRole("link", { name: "+ Adicionar bloco" }).dataset["variant"]).toBe("dashed");
  });

  it("variante link: data-variant, cor do papel, sem violações", async () => {
    const { container } = render(<Button variant="link" color="down">Esqueci a senha</Button>);
    const b = screen.getByRole("button", { name: "Esqueci a senha" });
    expect([b.dataset["variant"], b.dataset["color"]]).toEqual(["link", "down"]);
    expect(v(b, "--button-height-sm")).toBe("var(--cf-button-height-sm)");
    await semViolacoes(container);
  });
});

describe("Button.Group", () => {
  it("role group com nome, horizontal por padrão, botões dentro", async () => {
    const { container } = render(
      <Button.Group aria-label="Período">
        <Button variant="outline">Dia</Button>
        <Button variant="outline">Semana</Button>
        <Button variant="outline">Mês</Button>
      </Button.Group>,
    );
    const g = screen.getByRole("group", { name: "Período" });
    expect(g.dataset["orientation"]).toBe("horizontal");
    expect(g.className).toMatch(/group/);
    expect(Array.from(g.children).map((b) => b.textContent)).toEqual(["Dia", "Semana", "Mês"]);
    await semViolacoes(container);
  });

  it("vertical e className do app", () => {
    render(<Button.Group aria-label="Alinhamento" orientation="vertical" className="meu"><Button>Topo</Button></Button.Group>);
    const g = screen.getByRole("group", { name: "Alinhamento" });
    expect(g.dataset["orientation"]).toBe("vertical");
    expect(g.classList.contains("meu")).toBe(true);
  });
});
