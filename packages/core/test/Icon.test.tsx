import { iconGrid, icons } from "@countify-oficial/tokens";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import { Icon, type IconName } from "../src";
import { semViolacoes } from "./setup";

describe("Icon", () => {
  // a 1ª transformação do mapa do Tabler (5.500 import()) passa de 1 s com o monorepo todo em paralelo
  beforeAll(async () => {
    await import("@countify-oficial/icons-tabler");
  });

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

  it("nome da Countify que também existe no Tabler fica com o desenho da Countify", () => {
    render(<Icon name="star" variant="filled" data-testid="i" />);
    const svg = screen.getByTestId("i");
    expect(svg.getAttribute("viewBox")).toBe("0 0 22 22");
    expect(svg.querySelector("path")?.getAttribute("d")).toBe(icons.star.slice('<path d="'.length, -'"/>'.length));
  });

  it("outros nomes vêm do Tabler (outline): traço currentColor na espessura do token, caixa de 24", async () => {
    const { container } = render(<Icon name="home" data-testid="i" size="sm" />);
    const svg = screen.getByTestId("i");
    await waitFor(() => expect(svg.querySelectorAll("path")).toHaveLength(4));
    expect(svg.getAttribute("viewBox")).toBe("0 0 24 24");
    expect(svg.getAttribute("fill")).toBe("none");
    expect(svg.getAttribute("stroke")).toBe("currentColor");
    expect(svg.getAttribute("stroke-width")).toBe(String(iconGrid.stroke));
    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(svg.querySelectorAll("path")[1]?.getAttribute("d")).toBe("M5 12l-2 0l9 -9l9 9l-2 0");
    expect(svg.style.getPropertyValue("--icon-size")).toBe("var(--cf-icon-size-sm)");
    await semViolacoes(container);
  });

  it("Tabler filled: preenchido em currentColor, sem traço; com label vira imagem", async () => {
    render(<Icon name="home" variant="filled" label="Início" />);
    const svg = screen.getByRole("img", { name: "Início" });
    await waitFor(() => expect(svg.querySelectorAll("path")).toHaveLength(2));
    expect(svg.getAttribute("fill")).toBe("currentColor");
    expect(svg.getAttribute("stroke")).toBe("none");
    expect(svg.getAttribute("stroke-width")).toBe(String(iconGrid.stroke));
    expect(svg.querySelectorAll("path")[1]?.getAttribute("d")).toMatch(/^M12\.707 2\.293l9 9/);
  });

  it("filled sem versão cheia no Tabler cai no traço; nome desconhecido fica vazio", async () => {
    render(<><Icon name="arrow-left" variant="filled" data-testid="a" /><Icon name={"constructor" as IconName} data-testid="b" /></>);
    const a = screen.getByTestId("a");
    await waitFor(() => expect(a.querySelectorAll("path")).toHaveLength(4));
    expect(a.getAttribute("fill")).toBe("none");
    expect(a.getAttribute("stroke")).toBe("currentColor");
    expect(screen.getByTestId("b").innerHTML).toBe("");
  });
});
