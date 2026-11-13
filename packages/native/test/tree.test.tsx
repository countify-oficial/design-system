import { fireEvent, render, screen } from "@testing-library/react-native";
import { Cascader, Mentions, Tree, TreeSelect, type TreeNode } from "../src";

const lojas: TreeNode[] = [
  {
    value: "ce",
    label: "Ceará",
    children: [
      { value: "for", label: "Fortaleza", children: [{ value: "lume", label: "Lume Jardins" }, { value: "aldeota", label: "Aldeota" }] },
      { value: "sob", label: "Sobral" },
    ],
  },
  { value: "sp", label: "São Paulo" },
];

describe("árvore e camadas (React Native)", () => {
  it("Tree: tocar no pai abre; tocar na folha escolhe", async () => {
    const aoEscolher = jest.fn();
    await render(<Tree data={lojas} leavesOnly onSelect={aoEscolher} />);
    const ce = screen.getByRole("button", { name: "Ceará" });
    expect(ce).toBeCollapsed();
    await fireEvent.press(ce);
    expect(ce).toBeExpanded();
    expect(aoEscolher).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByRole("button", { name: "Sobral" }));
    expect(aoEscolher).toHaveBeenLastCalledWith("sob", { value: "sob", label: "Sobral" });
    expect(screen.getByRole("button", { name: "Sobral" })).toBeSelected();
  });

  it("Tree com caixas: o pai fica meio marcado", async () => {
    const aoMarcar = jest.fn();
    await render(<Tree data={lojas} withCheckboxes defaultExpanded={["ce"]} onCheckedChange={aoMarcar} />);
    await fireEvent.press(screen.getByRole("checkbox", { name: "Fortaleza" }));
    expect(aoMarcar).toHaveBeenLastCalledWith(["lume", "aldeota"]);
    expect(screen.getByRole("checkbox", { name: "Ceará" })).toBePartiallyChecked();
  });

  it("TreeSelect: escolhe na folha e mostra no campo", async () => {
    const aoMudar = jest.fn();
    await render(<TreeSelect label="Loja" data={lojas} onChange={aoMudar} />);
    await fireEvent.press(screen.getByRole("combobox", { name: "Loja" }));
    await fireEvent.press(screen.getByRole("button", { name: "São Paulo" }));
    expect(aoMudar).toHaveBeenLastCalledWith("sp");
    expect(screen.getByText("São Paulo")).toBeOnTheScreen();
  });

  it("Cascader: entra nas camadas, volta e escolhe o caminho", async () => {
    const aoMudar = jest.fn();
    await render(<Cascader label="Loja" data={lojas} onChange={aoMudar} />);
    await fireEvent.press(screen.getByRole("combobox", { name: "Loja" }));
    await fireEvent.press(screen.getByRole("menuitem", { name: "Ceará" }));
    await fireEvent.press(screen.getByRole("menuitem", { name: "Fortaleza" }));
    await fireEvent.press(screen.getByRole("button", { name: "Voltar" }));
    expect(screen.getByRole("menuitem", { name: "Sobral" })).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole("menuitem", { name: "Fortaleza" }));
    await fireEvent.press(screen.getByRole("menuitem", { name: "Aldeota" }));
    expect(aoMudar).toHaveBeenLastCalledWith(["ce", "for", "aldeota"], expect.any(Array));
    expect(screen.getByText("Ceará / Fortaleza / Aldeota")).toBeOnTheScreen();
  });

  it("Mentions: @ mostra as pessoas; tocar põe o nome no texto", async () => {
    const aoMudar = jest.fn();
    await render(<Mentions label="Comentário" data={["Ana Lima", "Bruno Reis"]} onChange={aoMudar} />);
    await fireEvent.changeText(screen.getByLabelText("Comentário"), "oi @br");
    expect(screen.getAllByRole("menuitem")).toHaveLength(1);
    await fireEvent.press(screen.getByRole("menuitem", { name: "Bruno Reis" }));
    expect(aoMudar).toHaveBeenLastCalledWith("oi @Bruno Reis ");
    expect(screen.queryByRole("menuitem")).toBeNull();
  });
});
