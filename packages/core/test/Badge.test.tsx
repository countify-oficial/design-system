import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "../src";
import { semViolacoes } from "./setup";

describe("Badge", () => {
  it("light gray por padrão (a etiqueta 'parcial')", async () => {
    const { container } = render(<Badge>parcial</Badge>);
    const b = screen.getByText("parcial");
    expect([b.dataset["variant"], b.dataset["color"]]).toEqual(["light", "gray"]);
    expect(b.style.getPropertyValue("--tone-tint")).toBe("var(--cf-color-chip)");
    await semViolacoes(container);
  });

  it("filled down (contador) e dot up (Online)", () => {
    render(<><Badge variant="filled" color="down">3</Badge><Badge variant="dot" color="up">Online</Badge></>);
    expect(screen.getByText("3").style.getPropertyValue("--tone-fill")).toBe("var(--cf-color-down)");
    expect(screen.getByText("Online").dataset["variant"]).toBe("dot");
    expect(screen.getByText("Online").style.getPropertyValue("--tone-c")).toBe("var(--cf-color-up)");
  });
});
