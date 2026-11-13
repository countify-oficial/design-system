import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Group } from "../src";

describe("Group", () => {
  it("centraliza na vertical e quebra a linha por padrão", () => {
    render(<Group data-testid="g" />);
    const el = screen.getByTestId("g");
    expect(el.style.getPropertyValue("--group-align")).toBe("center");
    expect(el.style.getPropertyValue("--group-gap")).toBe("var(--cf-spacing-md)");
    expect(el.hasAttribute("data-nowrap")).toBe(false);
  });

  it("wrap={false} e grow marcam data-attributes", () => {
    render(<Group data-testid="g" wrap={false} grow gap="xs" justify="flex-end" />);
    const el = screen.getByTestId("g");
    expect(el.hasAttribute("data-nowrap")).toBe(true);
    expect(el.hasAttribute("data-grow")).toBe(true);
    expect(el.style.getPropertyValue("--group-justify")).toBe("flex-end");
  });
});
