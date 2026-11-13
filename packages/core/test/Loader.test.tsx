import { CountifyProvider } from "@countify-oficial/provider";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Loader } from "../src";
import { semViolacoes } from "./setup";

describe("Loader", () => {
  it("anuncia 'Carregando' (texto do provider), na cor accent", async () => {
    const { container } = render(<Loader />);
    const el = screen.getByRole("status", { name: "Carregando" });
    expect(el.style.getPropertyValue("--loader-color")).toBe("var(--cf-color-accent)");
    expect(el.style.getPropertyValue("--loader-size")).toBe("var(--cf-icon-size-md)");
    await semViolacoes(container);
  });

  it("o texto segue o provider; label={false} é decorativo; currentColor herda a cor", () => {
    render(
      <CountifyProvider messages={{ loading: "Loading" }}>
        <Loader />
        <Loader label={false} color="currentColor" data-testid="d" />
      </CountifyProvider>,
    );
    expect(screen.getByRole("status", { name: "Loading" })).toBeTruthy();
    const d = screen.getByTestId("d");
    expect(d.getAttribute("aria-hidden")).toBe("true");
    expect(d.hasAttribute("role")).toBe(false);
    expect(d.style.getPropertyValue("--loader-color")).toBe("currentColor");
  });
});
