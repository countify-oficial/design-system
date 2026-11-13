import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PasswordInput } from "../src";
import { semViolacoes } from "./setup";

describe("PasswordInput", () => {
  it("esconde a senha e o botão mostra e oculta", async () => {
    const user = userEvent.setup();
    const { container } = render(<PasswordInput label="Senha" />);
    const campo = screen.getByLabelText("Senha");
    expect(campo.getAttribute("type")).toBe("password");
    await user.click(screen.getByRole("button", { name: "Mostrar senha" }));
    expect(campo.getAttribute("type")).toBe("text");
    expect(screen.getByRole("button", { name: "Ocultar senha" })).toBeTruthy();
    await semViolacoes(container);
  });
});
