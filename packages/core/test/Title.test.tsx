import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Title } from "../src";
import { semViolacoes } from "./setup";

const v = (el: HTMLElement, n: string) => el.style.getPropertyValue(n);

describe("Title", () => {
  it("h1: título da tela no celular (22) e da página a partir de 768 (28)", async () => {
    const { container } = render(<Title>Painel</Title>);
    const h = screen.getByRole("heading", { level: 1, name: "Painel" });
    expect([v(h, "--title-fz"), v(h, "--title-fz-sm")]).toEqual(["var(--cf-heading-screen-title-size)", "var(--cf-heading-page-title-size)"]);
    await semViolacoes(container);
  });

  it("h2 é título de seção; overline em maiúsculas e texto 2; number com algarismos iguais", () => {
    render(<><Title order={2}>Fluxo</Title><Title order={3} size="overline">Salvas</Title><Title order={4} size="number">1.284</Title></>);
    expect(v(screen.getByRole("heading", { level: 2 }), "--title-fz")).toBe("var(--cf-heading-section-size)");
    const o = screen.getByRole("heading", { level: 3 });
    expect(o.hasAttribute("data-overline")).toBe(true);
    expect(v(o, "--title-color")).toBe("var(--cf-color-text2)");
    expect(screen.getByRole("heading", { level: 4 }).hasAttribute("data-number")).toBe(true);
  });

  it("cor que não existe nos tokens vira a de reserva (texto)", () => {
    render(<Title color={"accent); background: red" as never}>X</Title>);
    expect(v(screen.getByRole("heading"), "--title-color")).toBe("var(--cf-color-text)");
  });
});
