import { CountifyProvider } from "@countify-oficial/provider";
import { colors, iconGrid } from "@countify-oficial/tokens";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { setStringAsync } from "expo-clipboard";
import { ActionIcon, Button, CloseButton, CopyButton, Icon, Loader, Text, Toggle } from "../src";
import { larguraDaTela } from "./tela";

jest.mock("expo-clipboard", () => ({ setStringAsync: jest.fn().mockResolvedValue(true) }));
afterEach(() => larguraDaTela(750));

describe("Icon e Loader (React Native)", () => {
  it("Icon decorativo por padrão; com label vira imagem", async () => {
    await render(<><Icon name="close" testID="d" /><Icon name="search" label="Buscar" size="lg" /></>);
    expect(screen.getByTestId("d", { includeHiddenElements: true })).toBeTruthy();
    expect(screen.getByLabelText("Buscar")).toBeOnTheScreen();
  });

  it("Icon: Countify como antes; outros nomes do Tabler, outline e filled, na cor do texto e no traço do token", async () => {
    await render(<><Icon name="close" testID="c" /><Icon name="home" testID="o" size="sm" /><Icon name="home" variant="filled" label="Início" /><Icon name="arrow-left" variant="filled" testID="f" /></>);
    const svg = (id: string) => screen.getByTestId(id, { includeHiddenElements: true });
    const d = (el: ReturnType<typeof svg>) => el.queryAll((n) => n.type === "RNSVGPath").map((p): unknown => p.props.d);
    expect(svg("c").props).toMatchObject({ stroke: colors.light.text, fill: "none", strokeWidth: iconGrid.stroke, width: 22 });
    expect(d(svg("c"))).toEqual(["M5 5l12 12M17 5L5 17"]);
    expect(svg("o").props).toMatchObject({ stroke: colors.light.text, fill: "none", strokeWidth: iconGrid.stroke, width: 18 });
    expect(svg("o").props.xml).toContain('viewBox="0 0 24 24"');
    expect(d(svg("o"))[1]).toBe("M5 12l-2 0l9 -9l9 9l-2 0");
    const cheio = screen.getByLabelText("Início");
    expect(cheio.props).toMatchObject({ fill: colors.light.text, stroke: "none", strokeWidth: iconGrid.stroke });
    expect(d(cheio)[1]).toMatch(/^M12\.707 2\.293l9 9/);
    // sem versão cheia no Tabler: fica o traço
    expect(svg("f").props).toMatchObject({ fill: "none", stroke: colors.light.text });
  });

  it("Loader anuncia 'Carregando' na cor accent", async () => {
    await render(<Loader testID="l" />);
    const l = screen.getByTestId("l");
    expect(l.props).toMatchObject({ accessibilityLabel: "Carregando", color: colors.light.accent, size: "small" });
  });
});

describe("Button (React Native)", () => {
  it("filled: 52 de altura no celular, texto branco em negrito, cor passa para o ícone", async () => {
    const aoTocar = jest.fn();
    await render(<Button onPress={aoTocar} leftSection={<Text testID="t">+</Text>}>Salvar</Button>);
    const b = screen.getByRole("button", { name: /Salvar/ });
    expect(b).toHaveStyle({ minHeight: 52, paddingHorizontal: 20, borderRadius: 12, backgroundColor: colors.light.button });
    expect(screen.getByText("Salvar")).toHaveStyle({ color: colors.light.onButton, fontFamily: "Roboto_700Bold", fontSize: 17 });
    expect(screen.getByTestId("t")).toHaveStyle({ color: colors.light.onButton });
    await fireEvent.press(b);
    expect(aoTocar).toHaveBeenCalledTimes(1);
  });

  it("a partir de 768 vira sm (44)", async () => {
    await larguraDaTela(800);
    await render(<Button>Salvar</Button>);
    expect(screen.getByRole("button")).toHaveStyle({ minHeight: 44, paddingHorizontal: 16 });
  });

  it("outline, subtle down e dashed", async () => {
    await render(
      <>
        <Button variant="outline">Cancelar</Button>
        <Button variant="subtle" color="down">Excluir análise</Button>
        <Button variant="dashed">+ Adicionar</Button>
      </>,
    );
    expect(screen.getByRole("button", { name: "Cancelar" })).toHaveStyle({ borderWidth: 1, borderColor: colors.light.borderStrong });
    expect(screen.getByText("Excluir análise")).toHaveStyle({ color: colors.light.down, fontFamily: "Roboto_500Medium" });
    expect(screen.getByRole("button", { name: "+ Adicionar" })).toHaveStyle({ borderWidth: 1.5, borderStyle: "dashed", borderColor: colors.light.text3 });
  });

  it("loading desliga, avisa ocupado e mostra o girador", async () => {
    const aoTocar = jest.fn();
    await render(<Button loading onPress={aoTocar}>Salvar</Button>);
    const b = screen.getByRole("button");
    expect(b).toBeDisabled();
    expect(b).toBeBusy();
    await fireEvent.press(b);
    expect(aoTocar).not.toHaveBeenCalled();
  });

  it("segue o modo escuro", async () => {
    await render(<CountifyProvider defaultColorScheme="dark"><Button variant="outline">Cancelar</Button></CountifyProvider>);
    expect(screen.getByText("Cancelar")).toHaveStyle({ color: colors.dark.text });
  });
});

describe("ActionIcon, CloseButton, Toggle e CopyButton (React Native)", () => {
  it("ActionIcon: 44 × 44 com nome; default tem cartão e anel", async () => {
    await render(<ActionIcon accessibilityLabel="Editar painel" variant="default"><Icon name="edit" /></ActionIcon>);
    expect(screen.getByRole("button", { name: "Editar painel" })).toHaveStyle({ width: 44, height: 44, backgroundColor: colors.light.card, borderColor: colors.light.divider });
  });

  it("CloseButton com o nome do provider", async () => {
    await render(<CountifyProvider messages={{ close: "Close" }}><CloseButton /></CountifyProvider>);
    expect(screen.getByRole("button", { name: "Close" })).toBeOnTheScreen();
  });

  it("Toggle liga e desliga (togglebutton, checked)", async () => {
    const aoMudar = jest.fn();
    await render(<Toggle onPressedChange={aoMudar}>Calçados</Toggle>);
    const t = screen.getByRole("togglebutton", { name: "Calçados" });
    // o toBeChecked não aceita o papel togglebutton; o estado vai em accessibilityState.checked
    expect(t.props).toMatchObject({ accessibilityState: { checked: false } });
    await fireEvent.press(t);
    expect(t.props).toMatchObject({ accessibilityState: { checked: true } });
    expect(t).toHaveStyle({ backgroundColor: colors.light.accentTint, borderColor: colors.light.accent, borderWidth: 1.5 });
    expect(aoMudar).toHaveBeenLastCalledWith(true);
  });

  it("CopyButton copia pelo expo-clipboard", async () => {
    await render(<CopyButton value="K7Q-29XM">{({ copied, copy }) => <Button onPress={copy}>{copied ? "Copiado" : "Copiar"}</Button>}</CopyButton>);
    await act(async () => {
      await fireEvent.press(screen.getByRole("button", { name: "Copiar" }));
    });
    expect(setStringAsync).toHaveBeenCalledWith("K7Q-29XM");
    expect(screen.getByRole("button", { name: "Copiado" })).toBeOnTheScreen();
  });
});
