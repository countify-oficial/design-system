import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Checkbox, selectAllState } from "../src";
import { semViolacoes } from "./setup";

describe("Checkbox", () => {
  it("caixa com rótulo e descrição; meio marcado", async () => {
    const { container } = render(<><Checkbox label="Lume Jardins" description="Fortaleza" defaultChecked /><Checkbox label="Selecionar todos" indeterminate /></>);
    expect(screen.getByRole("checkbox", { name: "Lume Jardins" })).toHaveProperty("checked", true);
    expect(screen.getByRole("checkbox", { name: "Selecionar todos" })).toHaveProperty("indeterminate", true);
    await semViolacoes(container);
  });

  it("Checkbox.Group guarda os marcados", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    render(
      <Checkbox.Group label="Lojas" defaultValue={["jardins"]} onChange={aoMudar}>
        <Checkbox value="jardins" label="Lume Jardins" />
        <Checkbox value="orla" label="Lume Orla" />
        <Checkbox value="aldeota" label="Lume Aldeota" description="Sem acesso" disabled />
      </Checkbox.Group>,
    );
    expect(screen.getByRole("group", { name: "Lojas" })).toBeTruthy();
    await user.click(screen.getByRole("checkbox", { name: "Lume Orla" }));
    expect(aoMudar).toHaveBeenLastCalledWith(["jardins", "orla"]);
    await user.click(screen.getByRole("checkbox", { name: "Lume Jardins" }));
    expect(aoMudar).toHaveBeenLastCalledWith(["orla"]);
    expect(screen.getByRole("checkbox", { name: "Lume Aldeota" })).toHaveProperty("disabled", true);
  });

  it("selectAllState", () => {
    expect([selectAllState(["a", "b"], []), selectAllState(["a", "b"], ["a"]), selectAllState(["a", "b"], ["b", "a"])]).toEqual(["none", "some", "all"]);
  });
});
