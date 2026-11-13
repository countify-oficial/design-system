import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Flex } from "../src";

describe("Flex", () => {
  it("cada prop vira uma variável; sem prop, a variável fica vazia", () => {
    render(<><Flex data-testid="a" direction="column" wrap="wrap" gap="sm" rowGap={5} align="end" justify="center" /><Flex data-testid="b" /></>);
    const a = screen.getByTestId("a").style;
    expect([a.getPropertyValue("--flex-direction"), a.getPropertyValue("--flex-wrap"), a.getPropertyValue("--flex-gap"), a.getPropertyValue("--flex-row-gap"), a.getPropertyValue("--flex-column-gap")])
      .toEqual(["column", "wrap", "var(--cf-spacing-sm)", "var(--cf-space-5)", ""]);
    expect(screen.getByTestId("b").getAttribute("style")).toBeNull();
  });
});
