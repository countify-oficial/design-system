import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { Autocomplete, Button, ComboboxPopover, MultiSelect, Pill, Select, TagsInput } from "../src";

const cidades = ["Fortaleza", "São Paulo", "Sobral"];

describe("escolha em folha (React Native)", () => {
  it("Select: o campo abre a folha; escolher fecha e mostra o valor", async () => {
    const aoMudar = jest.fn();
    await render(<Select label="Cidade" placeholder="Escolha" data={cidades} onChange={aoMudar} />);
    const campo = screen.getByRole("combobox", { name: "Cidade" });
    await fireEvent.press(campo);
    expect(campo).toBeExpanded();
    await fireEvent.press(screen.getByRole("menuitem", { name: "Sobral" }));
    expect(aoMudar).toHaveBeenLastCalledWith("Sobral", { value: "Sobral", label: "Sobral" });
    expect(screen.getByText("Sobral")).toBeOnTheScreen();
    expect(screen.queryByRole("menuitem")).toBeNull();
  });

  it("Select searchable filtra sem acento", async () => {
    await render(<Select label="Cidade" data={cidades} searchable />);
    await fireEvent.press(screen.getByRole("combobox"));
    await fireEvent.changeText(screen.getByLabelText("Buscar"), "sao");
    expect(screen.getAllByRole("menuitem")).toHaveLength(1);
  });

  it("MultiSelect: marca vários sem fechar; etiquetas no campo", async () => {
    const aoMudar = jest.fn();
    await render(<MultiSelect label="Lojas" data={["Jardins", "Orla"]} onChange={aoMudar} />);
    await fireEvent.press(screen.getByRole("combobox", { name: "Lojas" }));
    await fireEvent.press(screen.getByRole("menuitem", { name: "Jardins" }));
    await fireEvent.press(screen.getByRole("menuitem", { name: "Orla" }));
    expect(aoMudar).toHaveBeenLastCalledWith(["Jardins", "Orla"]);
    expect(screen.getByRole("menuitem", { name: "Orla" })).toBeSelected();
  });

  it("Autocomplete: sugestões abaixo do campo enquanto digita", async () => {
    const escolheu = jest.fn();
    await render(<Autocomplete label="Loja" data={["Lume Jardins", "Lume Orla"]} onOptionSubmit={escolheu} />);
    const campo = screen.getByLabelText("Loja");
    await fireEvent(campo, "focus");
    await fireEvent.changeText(campo, "orl");
    await fireEvent.press(screen.getByRole("menuitem", { name: "Lume Orla" }));
    expect(escolheu).toHaveBeenCalledWith("Lume Orla");
  });

  it("TagsInput: OK do teclado e vírgula criam; repetida não entra", async () => {
    const aoMudar = jest.fn();
    await render(<TagsInput label="Categorias" onChange={aoMudar} />);
    const campo = screen.getByLabelText("Categorias");
    await fireEvent.changeText(campo, "Calçados");
    await fireEvent(campo, "submitEditing");
    await fireEvent.changeText(campo, "calcados,");
    expect(aoMudar).toHaveBeenCalledTimes(1);
    expect(aoMudar).toHaveBeenLastCalledWith(["Calçados"]);
  });

  it("Pill: botão de tirar com nome", async () => {
    const tirar = jest.fn();
    await render(<Pill withRemoveButton onRemove={tirar}>Calçados</Pill>);
    await fireEvent.press(screen.getByRole("button", { name: "Remover Calçados" }));
    expect(tirar).toHaveBeenCalled();
  });

  it("ComboboxPopover: o botão abre a folha com busca", async () => {
    const aoMudar = jest.fn();
    await render(<ComboboxPopover data={cidades} title="Cidade" onChange={aoMudar}><Button variant="outline">Cidade</Button></ComboboxPopover>);
    await fireEvent.press(screen.getByRole("button", { name: "Cidade" }));
    await act(async () => {
      await fireEvent.press(screen.getByRole("menuitem", { name: "Fortaleza" }));
    });
    expect(aoMudar).toHaveBeenLastCalledWith("Fortaleza", { value: "Fortaleza", label: "Fortaleza" });
  });
});
