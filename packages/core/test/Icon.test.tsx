import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Icon } from "../src";
import { semViolacoes } from "./setup";

describe("Icon", () => {
  it("desenha o ícone dos tokens, decorativo por padrão", async () => {
    const { container } = render(<Icon name="close" data-testid="i" />);
    const svg = screen.getByTestId("i");
    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(svg.getAttribute("viewBox")).toBe("0 0 22 22");
    expect(svg.getAttribute("stroke-width")).toBe("1.8");
    expect(svg.querySelector("path")?.getAttribute("d")).toBe("M5 5l12 12M17 5L5 17");
    expect(svg.style.getPropertyValue("--icon-size")).toBe("var(--cf-icon-size-md)");
    await semViolacoes(container);
  });

  it("com label vira imagem com nome", () => {
    render(<Icon name="search" label="Buscar" size="lg" />);
    expect(screen.getByRole("img", { name: "Buscar" }).style.getPropertyValue("--icon-size")).toBe("var(--cf-icon-size-lg)");
  });
});
