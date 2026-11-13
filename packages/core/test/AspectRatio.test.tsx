import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AspectRatio } from "../src";
import { semViolacoes } from "./setup";

describe("AspectRatio", () => {
  it("proporção 1 por padrão; ratio vira variável", async () => {
    const { container } = render(<><AspectRatio data-testid="a" /><AspectRatio data-testid="b" ratio={16 / 9}><img src="loja.jpg" alt="Fachada da loja" /></AspectRatio></>);
    expect(screen.getByTestId("a").style.getPropertyValue("--ar-ratio")).toBe("1");
    expect(Number(screen.getByTestId("b").style.getPropertyValue("--ar-ratio"))).toBeCloseTo(16 / 9);
    await semViolacoes(container);
  });
});
