import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Divider } from "../src";
import { semViolacoes } from "./setup";

describe("Divider", () => {
  it("separador horizontal na cor da divisória", async () => {
    const { container } = render(<Divider />);
    const d = screen.getByRole("separator");
    expect(d.getAttribute("aria-orientation")).toBe("horizontal");
    expect(d.style.getPropertyValue("--divider-color")).toBe("var(--cf-color-divider)");
    expect(d.style.getPropertyValue("--divider-style")).toBe("solid");
    await semViolacoes(container);
  });

  it("vertical, tracejado e com texto", () => {
    render(<><Divider orientation="vertical" variant="dashed" data-testid="v" /><Divider label="ou" labelPosition="left" data-testid="t" /></>);
    expect(screen.getByTestId("v").dataset["orientation"]).toBe("vertical");
    expect(screen.getByTestId("v").style.getPropertyValue("--divider-style")).toBe("dashed");
    expect(screen.getByTestId("t").textContent).toBe("ou");
    expect(screen.getByTestId("t").dataset["labelPosition"]).toBe("left");
  });
});
