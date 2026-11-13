import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PinInput } from "../src";
import { semViolacoes } from "./setup";

describe("PinInput", () => {
  it("avança sozinho, termina com onComplete e volta com Backspace", async () => {
    const user = userEvent.setup();
    const pronto = vi.fn();
    const { container } = render(<PinInput onComplete={pronto} />);
    const caixas = screen.getAllByRole("textbox");
    expect(caixas.map((c) => c.getAttribute("aria-label"))).toEqual(["Código, 1 de 4", "Código, 2 de 4", "Código, 3 de 4", "Código, 4 de 4"]);
    await user.click(caixas[0] as HTMLElement);
    await user.keyboard("12a34");
    expect(caixas.map((c) => (c as HTMLInputElement).value).join("")).toBe("1234");
    expect(pronto).toHaveBeenCalledWith("1234");
    await user.keyboard("{Backspace}{Backspace}");
    expect(caixas.map((c) => (c as HTMLInputElement).value).join("")).toBe("12");
    expect(document.activeElement).toBe(caixas[2]);
    await semViolacoes(container);
  });

  it("colar preenche as caixas; alfanumérico aceita letras", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    render(<PinInput length={6} type="alphanumeric" label="Código da câmera" onChange={aoMudar} />);
    await user.click(screen.getAllByRole("textbox")[0] as HTMLElement);
    await user.paste("K7Q29X");
    expect(aoMudar).toHaveBeenLastCalledWith("K7Q29X");
  });
});
