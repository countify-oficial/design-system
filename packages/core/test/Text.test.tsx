import { CountifyProvider, createTheme } from "@countify-oficial/provider";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Text } from "../src";
import { semViolacoes } from "./setup";

const varCss = (el: HTMLElement, nome: string) => el.style.getPropertyValue(nome);

describe("Text", () => {
  it("é um <p> md regular, sem cor nem alinhamento próprios", async () => {
    const { container } = render(<Text>Vendas de hoje</Text>);
    const p = screen.getByText("Vendas de hoje");
    expect(p.tagName).toBe("P");
    expect(p.dataset["size"]).toBe("md");
    expect(varCss(p, "--text-size")).toBe("var(--cf-font-size-md)");
    expect(varCss(p, "--text-weight")).toBe("var(--cf-font-weight-regular)");
    expect(varCss(p, "--text-color")).toBe("");
    expect(varCss(p, "--text-align")).toBe("");
    await semViolacoes(container);
  });

  it("size, color (papel do token), weight e align viram variáveis CSS", () => {
    render(<Text size="xs" color="accentHover" weight="bold" align="center">Ver mais</Text>);
    const p = screen.getByText("Ver mais");
    expect(p.dataset["size"]).toBe("xs");
    expect(varCss(p, "--text-size")).toBe("var(--cf-font-size-xs)");
    expect(varCss(p, "--text-color")).toBe("var(--cf-color-accent-hover)");
    expect(varCss(p, "--text-weight")).toBe("var(--cf-font-weight-bold)");
    expect(varCss(p, "--text-align")).toBe("center");
  });

  it("truncate, lineClamp e inherit marcam data-attributes", () => {
    render(<><Text truncate>a</Text><Text lineClamp={2}>b</Text><Text inherit>c</Text></>);
    expect(screen.getByText("a").hasAttribute("data-truncate")).toBe(true);
    expect(screen.getByText("b").dataset["lineClamp"]).toBe("2");
    expect(varCss(screen.getByText("b"), "--text-line-clamp")).toBe("2");
    expect(screen.getByText("c").hasAttribute("data-inherit")).toBe(true);
  });

  it("component troca o elemento (label com htmlFor)", () => {
    render(<Text component="label" htmlFor="campo">Nome</Text>);
    expect(screen.getByText("Nome").tagName).toBe("LABEL");
    expect(screen.getByText("Nome").getAttribute("for")).toBe("campo");
  });

  it("defaultProps do tema valem; a prop vale mais", () => {
    const theme = createTheme({ components: { Text: { defaultProps: { size: "sm", color: "text2" } } } });
    render(<CountifyProvider theme={theme}><Text>tema</Text><Text size="lg">prop</Text></CountifyProvider>);
    expect(screen.getByText("tema").dataset["size"]).toBe("sm");
    expect(varCss(screen.getByText("tema"), "--text-color")).toBe("var(--cf-color-text2)");
    expect(screen.getByText("prop").dataset["size"]).toBe("lg");
  });
});
