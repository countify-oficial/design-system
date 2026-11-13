import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Icon, ThemeIcon } from "../src";

describe("ThemeIcon", () => {
  it("quadrado de 40 com tinta do destaque, canto 12", () => {
    render(<ThemeIcon data-testid="t"><Icon name="store" /></ThemeIcon>);
    const t = screen.getByTestId("t");
    expect(t.style.getPropertyValue("--ti-size")).toBe("var(--cf-avatar-size-md)");
    expect(t.style.getPropertyValue("--ti-radius")).toBe("var(--cf-radius-sm)");
    expect(t.style.getPropertyValue("--tone-tint")).toBe("var(--cf-color-accent-tint)");
  });

  it("filled, redondo e outro tom", () => {
    render(<ThemeIcon data-testid="t" variant="filled" round color="up" size="xl" />);
    const t = screen.getByTestId("t");
    expect([t.dataset["variant"], t.hasAttribute("data-round")]).toEqual(["filled", true]);
    expect(t.style.getPropertyValue("--tone-fill")).toBe("var(--cf-color-up)");
  });
});
