import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MultiSelect, Pill, PillsInput, TagsInput } from "../src";
import { semViolacoes } from "./setup";

describe("Pill e PillsInput", () => {
  it("Pill com botão de tirar", async () => {
    const user = userEvent.setup();
    const tirar = vi.fn();
    const { container } = render(<Pill withRemoveButton onRemove={tirar}>Calçados</Pill>);
    await user.click(screen.getByRole("button", { name: "Remover Calçados" }));
    expect(tirar).toHaveBeenCalled();
    await semViolacoes(container);
  });

  it("PillsInput: o rótulo é do campo", () => {
    render(<PillsInput label="Etiquetas"><Pill>A</Pill><PillsInput.Field /></PillsInput>);
    expect(screen.getByRole("textbox", { name: "Etiquetas" })).toBeTruthy();
  });
});

describe("MultiSelect", () => {
  it("escolhe vários (etiquetas), alterna e tira com Backspace", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    const { baseElement } = render(<MultiSelect label="Lojas" data={["Jardins", "Orla", "Centro"]} onChange={aoMudar} />);
    const campo = screen.getByRole("combobox", { name: "Lojas" });
    await user.click(campo);
    await user.click(screen.getByRole("option", { name: "Jardins" }));
    await user.click(screen.getByRole("option", { name: "Centro" }));
    expect(aoMudar).toHaveBeenLastCalledWith(["Jardins", "Centro"]);
    expect(screen.getByRole("option", { name: "Centro" }).getAttribute("aria-selected")).toBe("true");
    await semViolacoes(baseElement);
    await user.keyboard("{Backspace}");
    expect(aoMudar).toHaveBeenLastCalledWith(["Jardins"]);
  });

  it("maxValues e hidePickedOptions", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    render(<MultiSelect label="Lojas" data={["Jardins", "Orla"]} defaultValue={["Jardins"]} maxValues={1} hidePickedOptions onChange={aoMudar} />);
    await user.click(screen.getByRole("combobox"));
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["Orla"]);
    await user.click(screen.getByRole("option", { name: "Orla" }));
    expect(aoMudar).not.toHaveBeenCalled();
  });
});

describe("TagsInput", () => {
  it("Enter e vírgula criam; repetida (sem acento) não entra; Backspace tira", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    render(<TagsInput label="Categorias" onChange={aoMudar} />);
    const campo = screen.getByRole("combobox", { name: "Categorias" });
    await user.type(campo, "Calçados{Enter}");
    await user.type(campo, "acessórios,");
    expect(aoMudar).toHaveBeenLastCalledWith(["Calçados", "acessórios"]);
    await user.type(campo, "calcados{Enter}");
    expect(aoMudar).toHaveBeenCalledTimes(2);
    await user.keyboard("{Backspace}");
    expect(aoMudar).toHaveBeenLastCalledWith(["Calçados"]);
  });
});
