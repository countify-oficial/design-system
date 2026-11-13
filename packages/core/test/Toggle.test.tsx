import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Toggle } from "../src";
import { semViolacoes } from "./setup";

describe("Toggle", () => {
  it("não controlado: liga e desliga com aria-pressed", async () => {
    const aoMudar = vi.fn();
    const { container } = render(<Toggle onPressedChange={aoMudar}>Calçados</Toggle>);
    const b = screen.getByRole("button", { name: "Calçados" });
    expect(b.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(b);
    expect(b.getAttribute("aria-pressed")).toBe("true");
    expect(b.hasAttribute("data-pressed")).toBe(true);
    expect(aoMudar).toHaveBeenLastCalledWith(true);
    await semViolacoes(container);
  });

  it("controlado: segue a prop", () => {
    const { rerender } = render(<Toggle pressed>Todos</Toggle>);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe("true");
    rerender(<Toggle pressed={false}>Todos</Toggle>);
    expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe("false");
  });
});
