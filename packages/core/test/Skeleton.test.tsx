import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton } from "../src";

describe("Skeleton", () => {
  it("bloco decorativo que pulsa; números viram px", () => {
    const { container } = render(<Skeleton height={32} width="60%" />);
    const s = container.firstElementChild as HTMLElement;
    expect(s.getAttribute("aria-hidden")).toBe("true");
    expect(s.hasAttribute("data-animate")).toBe(true);
    expect([s.style.getPropertyValue("--sk-height"), s.style.getPropertyValue("--sk-width")]).toEqual(["32px", "60%"]);
  });

  it("visible={false} mostra o conteúdo; circle e radius", () => {
    const { container } = render(<><Skeleton visible={false}><p>1.284</p></Skeleton><Skeleton circle animate={false} radius="sm" /></>);
    expect(screen.getByText("1.284")).toBeTruthy();
    const s = container.querySelector("[data-circle]") as HTMLElement;
    expect(s.hasAttribute("data-animate")).toBe(false);
    expect(s.style.getPropertyValue("--sk-radius")).toBe("var(--cf-radius-sm)");
  });
});
