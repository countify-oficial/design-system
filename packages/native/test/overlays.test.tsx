import { colors } from "@countify-oficial/tokens";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { ActionBar, Button, ColorInput, Drawer, LoadingOverlay, Menu, Modal, Overlay, Popover, Tooltip } from "../src";
import { larguraDaTela } from "./tela";

const l = colors.light;
afterEach(() => larguraDaTela(750));

describe("véus e janelas (React Native)", () => {
  it("Overlay: o véu na cor scrim a 72%", async () => {
    await render(<Overlay testID="o" />);
    const veu = screen.getByTestId("o").children[0];
    if (typeof veu === "string" || !veu) throw new Error("sem véu");
    expect(veu).toHaveStyle({ backgroundColor: l.scrim, opacity: 0.72 });
  });

  it("LoadingOverlay mostra o girador", async () => {
    await render(<LoadingOverlay visible />);
    expect(screen.getByLabelText("Carregando")).toBeOnTheScreen();
  });

  it("Modal: título, fechar chama onClose", async () => {
    const fechar = jest.fn();
    await render(<Modal opened onClose={fechar} title="Excluir análise?" testID="m"><Text>Sai de Salvas.</Text></Modal>);
    expect(screen.getByRole("header", { name: "Excluir análise?" })).toBeOnTheScreen();
    expect(screen.getByTestId("m")).toHaveStyle({ maxWidth: 440, padding: 24, borderRadius: 16 });
    await fireEvent.press(screen.getByRole("button", { name: "Fechar" }));
    expect(fechar).toHaveBeenCalled();
  });

  it("Drawer: folha no celular (topo de 24) e painel de 380 no tablet", async () => {
    await render(<Drawer opened onClose={() => undefined} title="Período" testID="d"><Text>Hoje</Text></Drawer>);
    expect(screen.getByTestId("d")).toHaveStyle({ borderTopLeftRadius: 24, backgroundColor: l.sheet });
    await larguraDaTela(800);
    expect(screen.getByTestId("d")).toHaveStyle({ width: 380 });
  });

  it("ActionBar: barra de ferramentas com nome", async () => {
    await render(<ActionBar opened accessibilityLabel="Ações das lojas"><Text>3 lojas</Text></ActionBar>);
    // a barra não agrupa (accessible) para os botões de dentro continuarem alcançáveis
    expect(screen.getByLabelText("Ações das lojas", { includeHiddenElements: true }).props).toMatchObject({ accessibilityRole: "toolbar" });
  });
});

describe("popover, menu e dica (React Native)", () => {
  it("Popover abre numa folha e marca o alvo como expandido", async () => {
    await render(
      <Popover title="Como calculamos">
        <Popover.Target><Button>Ajuda</Button></Popover.Target>
        <Popover.Dropdown><Text>Vendas ÷ entradas</Text></Popover.Dropdown>
      </Popover>,
    );
    await fireEvent.press(screen.getByRole("button", { name: "Ajuda" }));
    expect(screen.getByText("Vendas ÷ entradas")).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Ajuda" })).toBeExpanded();
  });

  it("Menu: itens na folha; escolher fecha", async () => {
    const duplicar = jest.fn();
    await render(
      <Menu>
        <Menu.Target><Button>Ações</Button></Menu.Target>
        <Menu.Dropdown><Menu.Item onPress={duplicar}>Duplicar</Menu.Item><Menu.Item color="down">Excluir</Menu.Item></Menu.Dropdown>
      </Menu>,
    );
    await fireEvent.press(screen.getByRole("button", { name: "Ações" }));
    expect(screen.getByText("Excluir")).toHaveStyle({ color: l.down });
    await fireEvent.press(screen.getByRole("menuitem", { name: "Duplicar" }));
    expect(duplicar).toHaveBeenCalled();
    expect(screen.queryByRole("menuitem")).toBeNull();
  });

  it("Tooltip: vira a dica do leitor de tela e aparece no toque longo", async () => {
    await render(<Tooltip label="Exportar CSV"><Button>Exportar</Button></Tooltip>);
    const b = screen.getByRole("button", { name: "Exportar" });
    expect(b.props.accessibilityHint).toBe("Exportar CSV");
    await fireEvent(b, "longPress");
    expect(screen.getByText("Exportar CSV")).toBeOnTheScreen();
  });

  it("ColorInput: escrever uma cor válida muda o valor", async () => {
    const aoMudar = jest.fn();
    await render(<ColorInput label="Cor" onChange={aoMudar} />);
    await fireEvent.changeText(screen.getByLabelText("Cor"), "#225ba5");
    expect(aoMudar).toHaveBeenLastCalledWith("#225ba5");
    await fireEvent.press(screen.getByRole("button", { name: "Escolher cor" }));
    expect(screen.getByRole("adjustable", { name: "Matiz" })).toBeOnTheScreen();
  });
});
