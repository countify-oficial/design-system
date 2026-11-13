import { CountifyProvider } from "@countify-oficial/provider";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { formatNumber, NumberFormatter, RollingNumber } from "../src";

describe("NumberFormatter e RollingNumber", () => {
  it("formatNumber em pt-BR", () => {
    expect(formatNumber(1284.5)).toBe("1.284,5");
    expect(formatNumber(21.4, { decimalScale: 2, fixedDecimalScale: true })).toBe("21,40");
    expect(formatNumber(0.08, { format: { style: "percent", signDisplay: "exceptZero" } })).toBe("+8%");
  });

  it("NumberFormatter: prefixo, sufixo e o idioma do provider; sem valor não mostra nada", () => {
    const { container } = render(
      <CountifyProvider locale="en-US">
        <NumberFormatter value={1284.5} prefix="$ " data-testid="n" />
        <NumberFormatter value={null} />
      </CountifyProvider>,
    );
    expect(screen.getByTestId("n").textContent).toBe("$ 1,284.5");
    expect(container.querySelectorAll("span")).toHaveLength(1);
  });

  it("RollingNumber: o leitor de tela lê o número; cada algarismo rola até o dígito", () => {
    const { container, rerender } = render(<RollingNumber value={1284} />);
    expect(screen.getByText("1.284")).toBeTruthy();
    const digitos = () => Array.from(container.querySelectorAll<HTMLElement>("[style*='--digit']")).map((e) => e.style.getPropertyValue("--digit"));
    expect(digitos()).toEqual(["1", "2", "8", "4"]);
    rerender(<RollingNumber value={1290} />);
    expect(digitos()).toEqual(["1", "2", "9", "0"]);
  });
});
