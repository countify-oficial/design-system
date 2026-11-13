import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Container } from "../src";

describe("Container", () => {
  it("é um div com a classe da margem lateral; component troca o elemento", () => {
    render(<Container component="main" data-testid="c">Página</Container>);
    expect(screen.getByTestId("c").tagName).toBe("MAIN");
    expect(screen.getByTestId("c").className).toMatch(/root/);
  });
});
