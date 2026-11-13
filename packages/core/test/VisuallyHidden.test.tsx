import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UnstyledButton, VisuallyHidden } from "../src";
import { semViolacoes } from "./setup";

describe("VisuallyHidden", () => {
  it("dá nome acessível a um botão só com ícone", async () => {
    const { container } = render(<UnstyledButton><span aria-hidden>×</span><VisuallyHidden>Fechar</VisuallyHidden></UnstyledButton>);
    expect(screen.getByRole("button", { name: "Fechar" })).toBeTruthy();
    expect(screen.getByText("Fechar").tagName).toBe("SPAN");
    expect(screen.getByText("Fechar").className).toMatch(/root/);
    await semViolacoes(container);
  });
});
