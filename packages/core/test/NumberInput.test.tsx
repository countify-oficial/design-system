import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NumberInput } from "../src";

describe("NumberInput", () => {
  it("lê e mostra no formato pt-BR", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    render(<NumberInput label="Área" onChange={aoMudar} suffix="m²" />);
    const campo = screen.getByRole("spinbutton", { name: "Área" });
    await user.type(campo, "1284,5");
    expect(aoMudar).toHaveBeenLastCalledWith(1284.5);
    await user.tab();
    expect((campo as HTMLInputElement).value).toBe("1.284,5");
  });

  it("setas do teclado andam pelo passo e respeitam o mínimo e o máximo", async () => {
    const user = userEvent.setup();
    render(<NumberInput label="Lojas" defaultValue={9} min={0} max={10} />);
    const campo = screen.getByRole("spinbutton");
    campo.focus();
    await user.keyboard("{ArrowUp}{ArrowUp}");
    expect(campo.getAttribute("aria-valuenow")).toBe("10");
    await user.keyboard("{ArrowDown}");
    expect(campo.getAttribute("aria-valuenow")).toBe("9");
  });

  it("withControls: botões − e + com nome", async () => {
    const user = userEvent.setup();
    render(<NumberInput label="Câmeras" defaultValue={1} min={1} withControls />);
    expect(screen.getByRole("button", { name: "Diminuir" }).hasAttribute("disabled")).toBe(true);
    await user.click(screen.getByRole("button", { name: "Aumentar" }));
    expect(screen.getByRole("spinbutton").getAttribute("aria-valuenow")).toBe("2");
  });

  it("ao sair, limita ao máximo", async () => {
    const user = userEvent.setup();
    render(<NumberInput label="Percentual" max={100} />);
    await user.type(screen.getByRole("spinbutton"), "150");
    await user.tab();
    expect(screen.getByRole<HTMLInputElement>("spinbutton").value).toBe("100");
  });
});
