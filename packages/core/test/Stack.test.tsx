import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Stack } from "../src";

const v = (el: HTMLElement, nome: string) => el.style.getPropertyValue(nome);

describe("Stack", () => {
  it("gap md por padrão; tamanho, degrau da grade de 4 e 0", () => {
    render(<><Stack data-testid="a" /><Stack data-testid="b" gap="xl" /><Stack data-testid="c" gap={3} /><Stack data-testid="d" gap={0} /></>);
    expect(v(screen.getByTestId("a"), "--stack-gap")).toBe("var(--cf-spacing-md)");
    expect(v(screen.getByTestId("b"), "--stack-gap")).toBe("var(--cf-spacing-xl)");
    expect(v(screen.getByTestId("c"), "--stack-gap")).toBe("var(--cf-space-3)");
    expect(v(screen.getByTestId("d"), "--stack-gap")).toBe("0");
  });

  it("align e justify; component troca o elemento", () => {
    render(<Stack component="ul" align="center" justify="space-between" data-testid="s" />);
    const el = screen.getByTestId("s");
    expect(el.tagName).toBe("UL");
    expect(v(el, "--stack-align")).toBe("center");
    expect(v(el, "--stack-justify")).toBe("space-between");
  });
});
