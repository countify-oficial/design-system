import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Switch } from "../src";
import { semViolacoes } from "./setup";

describe("Switch", () => {
  it("papel switch, liga ao clicar no rótulo ou com a barra de espaço", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    const { container } = render(<Switch label="Avisar quando entrar" description="Receber avisos de entrada" onChange={aoMudar} />);
    const s = screen.getByRole("switch", { name: "Avisar quando entrar" });
    await user.click(screen.getByText("Avisar quando entrar"));
    expect(s).toHaveProperty("checked", true);
    s.focus();
    await user.keyboard(" ");
    expect(s).toHaveProperty("checked", false);
    expect(aoMudar).toHaveBeenCalledTimes(2);
    await semViolacoes(container);
  });

  it("Switch.Group guarda os ligados", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    render(<Switch.Group label="Avisos" onChange={aoMudar}><Switch value="entrada" label="Entrada" /><Switch value="sistema" label="Sistema" /></Switch.Group>);
    await user.click(screen.getByRole("switch", { name: "Sistema" }));
    expect(aoMudar).toHaveBeenLastCalledWith(["sistema"]);
  });
});
