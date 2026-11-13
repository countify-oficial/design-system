import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Chip } from "../src";
import { semViolacoes } from "./setup";

describe("Chip", () => {
  it("sozinho marca e desmarca", async () => {
    const user = userEvent.setup();
    const { container } = render(<Chip>Calçados</Chip>);
    const c = screen.getByRole("checkbox", { name: "Calçados" });
    await user.click(screen.getByText("Calçados"));
    expect(c).toHaveProperty("checked", true);
    await semViolacoes(container);
  });

  it("Chip.Group: um só (radio) ou vários", async () => {
    const user = userEvent.setup();
    const um = vi.fn();
    const varios = vi.fn();
    render(
      <>
        <Chip.Group label="Período" onChange={um}><Chip value="hoje">Hoje</Chip><Chip value="ontem">Ontem</Chip></Chip.Group>
        <Chip.Group label="Categorias" multiple defaultValue={["calcados"]} onChange={varios}><Chip value="calcados">Calçados</Chip><Chip value="acessorios">Acessórios</Chip></Chip.Group>
      </>,
    );
    expect(screen.getByRole("radiogroup", { name: "Período" })).toBeTruthy();
    await user.click(screen.getByText("Ontem"));
    expect(um).toHaveBeenLastCalledWith(["ontem"]);
    await user.click(screen.getByText("Acessórios"));
    expect(varios).toHaveBeenLastCalledWith(["calcados", "acessorios"]);
  });
});
