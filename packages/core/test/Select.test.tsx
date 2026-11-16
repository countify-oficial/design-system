import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Autocomplete, Button, ComboboxPopover, filterCombobox, Mentions, parseComboboxData, Select, TextInput } from "../src";
import { semViolacoes } from "./setup";

const cidades = ["Fortaleza", "São Paulo", "Sobral", { value: "crato", label: "Crato", disabled: true }];

describe("dados do Combobox", () => {
  it("grupos e busca sem acento", () => {
    const g = parseComboboxData(["A", { group: "Ceará", items: ["Fortaleza", "Sobral"] }]);
    expect(g.map((x) => x.group)).toEqual([null, "Ceará"]);
    expect(filterCombobox(parseComboboxData(cidades), "sao").flatMap((x) => x.items.map((i) => i.label))).toEqual(["São Paulo"]);
    expect(filterCombobox(parseComboboxData(cidades), "", 2).flatMap((x) => x.items)).toHaveLength(2);
  });
});

describe("Select", () => {
  it("abre, anda com setas, escolhe com Enter; o campo mostra o rótulo", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    const { baseElement } = render(<Select label="Cidade" data={cidades} onChange={aoMudar} />);
    const campo = screen.getByRole("combobox", { name: "Cidade" });
    await user.click(campo);
    expect(screen.getByRole("listbox")).toBeTruthy();
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["Fortaleza", "São Paulo", "Sobral", "Crato"]);
    await semViolacoes(baseElement);
    await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");
    expect(aoMudar).toHaveBeenLastCalledWith("São Paulo", { value: "São Paulo", label: "São Paulo" });
    expect((campo as HTMLInputElement).value).toBe("São Paulo");
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
  });

  it("searchable filtra; vazio mostra a mensagem; clearable limpa", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    render(<Select label="Cidade" data={cidades} searchable clearable defaultValue="Sobral" onChange={aoMudar} />);
    const campo = screen.getByRole("combobox", { name: "Cidade" });
    await user.clear(campo);
    await user.type(campo, "xyz");
    expect(screen.getByText("Nada encontrado")).toBeTruthy();
    await user.tab();
    await user.click(screen.getByRole("button", { name: "Limpar" }));
    expect(aoMudar).toHaveBeenLastCalledWith(null, null);
  });

  it("searchable: ao clicar, o texto do escolhido fica selecionado e a busca o substitui", async () => {
    const user = userEvent.setup();
    render(<Select label="Cidade" data={cidades} searchable defaultValue="Sobral" />);
    const campo = screen.getByRole<HTMLInputElement>("combobox", { name: "Cidade" });
    await user.click(campo);
    expect([campo.selectionStart, campo.selectionEnd]).toEqual([0, "Sobral".length]);
    await user.keyboard("Forta");
    expect(campo.value).toBe("Forta");
    expect(screen.getByRole("option", { name: "Fortaleza" })).toBeTruthy();
  });

  it("escolher a escolhida tira a escolha (allowDeselect)", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    render(<Select label="Cidade" data={cidades} defaultValue="Fortaleza" onChange={aoMudar} />);
    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("option", { name: "Fortaleza" }).getAttribute("aria-selected")).toBe("true");
    await user.click(screen.getByRole("option", { name: "Fortaleza" }));
    expect(aoMudar).toHaveBeenLastCalledWith(null, null);
  });
});

describe("Autocomplete e ComboboxPopover", () => {
  it("Autocomplete: texto livre com sugestões", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    render(<Autocomplete label="Loja" data={["Lume Jardins", "Lume Orla"]} onChange={aoMudar} />);
    const campo = screen.getByRole("combobox", { name: "Loja" });
    await user.type(campo, "orl");
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["Lume Orla"]);
    await user.click(screen.getByRole("option"));
    expect(aoMudar).toHaveBeenLastCalledWith("Lume Orla");
  });

  it("Tab fecha a lista; o onFocus e o onClick de quem usa continuam valendo", async () => {
    const user = userEvent.setup();
    const aoFocar = vi.fn();
    const aoClicar = vi.fn();
    render(
      <>
        <Autocomplete label="Loja" data={["Lume Jardins", "Lume Orla"]} onFocus={aoFocar} />
        <Select label="Cidade" data={cidades} onClick={aoClicar} />
        <TextInput label="Depois" />
      </>,
    );
    await user.click(screen.getByRole("combobox", { name: "Loja" }));
    expect(aoFocar).toHaveBeenCalledOnce();
    expect(screen.getByRole("listbox")).toBeTruthy();
    await user.tab();
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
    await user.click(screen.getByRole("combobox", { name: "Cidade" }));
    expect(aoClicar).toHaveBeenCalledOnce();
    expect(screen.getByRole("listbox")).toBeTruthy();
    await user.tab();
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
  });

  it("Mentions: Esc dispensa a lista da menção; outra menção abre de novo", async () => {
    const user = userEvent.setup();
    render(<Mentions label="Comentário" data={["Ana", "Bruno"]} />);
    const campo = screen.getByRole("textbox", { name: "Comentário" });
    await user.type(campo, "oi @a");
    expect(screen.getByRole("listbox")).toBeTruthy();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
    await user.type(campo, "n");
    expect(screen.queryByRole("listbox")).toBeNull();
    await user.type(campo, " @b");
    expect(screen.getByRole("listbox")).toBeTruthy();
  });

  it("ComboboxPopover: botão abre busca e opções; escolher fecha", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    render(<ComboboxPopover data={cidades} onChange={aoMudar}><Button variant="outline">Cidade</Button></ComboboxPopover>);
    await user.click(screen.getByRole("button", { name: "Cidade" }));
    const busca = await screen.findByRole("combobox", { name: "Buscar" });
    // a lista solta tem o mesmo limite das que flutuam (6 linhas) e rola por dentro
    const lista = screen.getByRole("listbox");
    expect([lista.style.maxHeight, lista.style.getPropertyValue("--combobox-max-height")]).toEqual([
      "var(--combobox-max-height)",
      "calc(6 * var(--cf-touch-target) + 2 * var(--cf-space-1))",
    ]);
    await user.type(busca, "sob");
    await user.keyboard("{ArrowDown}{Enter}");
    expect(aoMudar).toHaveBeenLastCalledWith("Sobral", { value: "Sobral", label: "Sobral" });
    await waitFor(() => expect(screen.queryByRole("combobox", { name: "Buscar" })).toBeNull());
  });
});
