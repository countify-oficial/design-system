import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar, initials } from "../src";
import { semViolacoes } from "./setup";

describe("Avatar", () => {
  it("iniciais", () => {
    expect([initials("Ana Souza"), initials("  maria da silva "), initials("Lume")]).toEqual(["AS", "MS", "LU"]);
  });

  it("sem foto: iniciais, com o nome para o leitor de tela", async () => {
    const { container } = render(<Avatar name="Ana Souza" />);
    const a = screen.getByRole("img", { name: "Ana Souza" });
    expect(a.textContent).toBe("AS");
    expect(a.style.getPropertyValue("--avatar-size")).toBe("var(--cf-avatar-size-md)");
    await semViolacoes(container);
  });

  it("com foto; se ela falhar, volta às iniciais", () => {
    render(<Avatar src="ana.jpg" name="Ana Souza" />);
    const img = screen.getByRole("img", { name: "Ana Souza" });
    expect(img.tagName).toBe("IMG");
    fireEvent.error(img);
    expect(screen.getByRole("img", { name: "Ana Souza" }).textContent).toBe("AS");
  });
});
