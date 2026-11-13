import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Space } from "../src";

describe("Space", () => {
  it("altura e largura pelos tokens, escondido do leitor de tela", () => {
    render(<Space data-testid="s" h="lg" w={2} />);
    const el = screen.getByTestId("s");
    expect(el.style.getPropertyValue("--space-h")).toBe("var(--cf-spacing-lg)");
    expect(el.style.getPropertyValue("--space-w")).toBe("var(--cf-space-2)");
    expect(el.getAttribute("aria-hidden")).toBe("true");
  });
});
