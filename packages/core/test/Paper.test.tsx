import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card, Paper } from "../src";
import { semViolacoes } from "./setup";

const v = (el: HTMLElement, n: string) => el.style.getPropertyValue(n);

describe("Paper e Card", () => {
  it("Paper: canto md, sem sombra; withBorder é o anel, em borda; shadow lg é a sombra", () => {
    render(<><Paper data-testid="a" /><Paper data-testid="b" withBorder /><Paper data-testid="c" shadow="lg" radius="xl" /></>);
    expect([v(screen.getByTestId("a"), "--paper-radius"), v(screen.getByTestId("a"), "--paper-shadow")]).toEqual(["var(--cf-radius-md)", ""]);
    expect(screen.getByTestId("a").hasAttribute("data-ring")).toBe(false);
    // o anel é borda (data-ring), não sombra interna: o fundo de um filho não o cobre
    expect([screen.getByTestId("b").hasAttribute("data-ring"), v(screen.getByTestId("b"), "--paper-shadow")]).toEqual([true, ""]);
    expect(screen.getByTestId("c").hasAttribute("data-ring")).toBe(false);
    expect([v(screen.getByTestId("c"), "--paper-shadow"), v(screen.getByTestId("c"), "--paper-radius")]).toEqual(["var(--cf-shadow-lg)", "var(--cf-radius-xl)"]);
  });

  it("Card: recuo e espaço de 16, anel; Card.Section encosta nas bordas", async () => {
    const { container } = render(
      <Card data-testid="card" component="article">
        <Card.Section data-testid="s" withBorder>Foto</Card.Section>
        <p>Lume Jardins</p>
      </Card>,
    );
    const card = screen.getByTestId("card");
    expect(card.tagName).toBe("ARTICLE");
    expect([v(card, "--card-padding"), v(card, "--card-gap"), card.hasAttribute("data-ring")]).toEqual(["var(--cf-spacing-md)", "var(--cf-spacing-md)", true]);
    expect(screen.getByTestId("s").className).toMatch(/section/);
    expect(screen.getByTestId("s").hasAttribute("data-with-border")).toBe(true);
    await semViolacoes(container);
  });
});
