import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Icon, Indicator } from "../src";

describe("Indicator", () => {
  it("contador vermelho no canto de cima", () => {
    render(<Indicator label={3}><Icon name="bell" label="Avisos" /></Indicator>);
    const n = screen.getByText("3");
    expect([n.dataset["position"], n.hasAttribute("data-withLabel") || n.hasAttribute("data-with-label")]).toEqual(["top-end", true]);
    expect(n.style.getPropertyValue("--tone-fill")).toBe("var(--cf-color-down)");
  });

  it("sem texto é bolinha; disabled esconde", () => {
    const { container, rerender } = render(<Indicator position="bottom-start" color="up"><span>x</span></Indicator>);
    expect(container.querySelector('[data-position="bottom-start"]')?.hasAttribute("data-with-label")).toBe(false);
    rerender(<Indicator disabled><span>x</span></Indicator>);
    expect(container.querySelector("[data-position]")).toBeNull();
  });
});
