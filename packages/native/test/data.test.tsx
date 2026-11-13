import { CountifyProvider } from "@countify-oficial/provider";
import { colors } from "@countify-oficial/tokens";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { Linking, Text } from "react-native";
import {
  Accordion, Anchor, BackgroundImage, Blockquote, Code, Collapse, ColorSwatch, DataList, Highlight, Image, List, Mark,
  NumberFormatter, OverflowList, RollingNumber, Spoiler, Timeline, Title,
} from "../src";
import { larguraDaTela } from "./tela";

const l = colors.light;
const layout = (height: number) => ({ nativeEvent: { layout: { x: 0, y: 0, width: 300, height } } });
afterEach(() => larguraDaTela(750));

describe("tipografia (React Native)", () => {
  it("Title: h1 é título da tela (22) e da página (28) a partir de 768; overline em maiúsculas", async () => {
    await render(<><Title>Painel</Title><Title order={2} size="overline">Salvas</Title></>);
    expect(screen.getByRole("header", { name: "Painel" })).toHaveStyle({ fontSize: 22, fontFamily: "Roboto_700Bold" });
    expect(screen.getByText("Salvas")).toHaveStyle({ textTransform: "uppercase", color: l.text2, fontSize: 13 });
    await larguraDaTela(800);
    expect(screen.getByText("Painel")).toHaveStyle({ fontSize: 28 });
  });

  it("Code, Mark e Highlight", async () => {
    await render(<><Code>npm i</Code><Text>a <Mark>parcial</Mark></Text><Highlight highlight="orla">Lume Orla</Highlight></>);
    expect(screen.getByText("npm i")).toHaveStyle({ fontFamily: "RobotoMono_400Regular", backgroundColor: l.chip });
    expect(screen.getByText("parcial")).toHaveStyle({ backgroundColor: l.warnTint });
    expect(screen.getByText("Orla")).toHaveStyle({ backgroundColor: l.warnTint });
  });

  it("Blockquote e List numerada", async () => {
    await render(<><Blockquote cite="— Ana">Mudou a reunião.</Blockquote><List type="ordered"><List.Item>Um</List.Item><List.Item>Dois</List.Item></List></>);
    expect(screen.getByText("— Ana")).toHaveStyle({ color: l.text2 });
    expect(screen.getByText("2.")).toBeOnTheScreen();
  });

  it("Anchor abre o endereço pelo sistema", async () => {
    const abrir = jest.spyOn(Linking, "openURL").mockResolvedValue(undefined);
    await render(<Anchor href="https://countify.com.br">site</Anchor>);
    const a = screen.getByRole("link", { name: "site" });
    expect(a).toHaveStyle({ color: l.accent });
    await fireEvent.press(a);
    expect(abrir).toHaveBeenCalledWith("https://countify.com.br");
  });
});

describe("imagem e números (React Native)", () => {
  it("Image com alt e reserva; BackgroundImage; ColorSwatch", async () => {
    await render(
      <>
        <Image src="https://x/loja.jpg" alt="Fachada" radius="md" fallbackSrc="https://x/vazio.png" />
        <BackgroundImage testID="b" src="https://x/f.jpg" radius="sm" />
        <ColorSwatch testID="c" color="rgb(10, 20, 30)" />
      </>,
    );
    const img = screen.getByLabelText("Fachada");
    expect(img).toHaveStyle({ borderRadius: 16 });
    await fireEvent(img, "error", {});
    expect(screen.getByLabelText("Fachada").props.source).toEqual({ uri: "https://x/vazio.png" });
    expect(screen.getByTestId("c")).toHaveStyle({ width: 28, backgroundColor: "rgb(10, 20, 30)" });
  });

  it("NumberFormatter no idioma do provider; RollingNumber lê o número inteiro", async () => {
    await render(
      <CountifyProvider locale="pt-BR">
        <NumberFormatter value={1284.5} prefix="R$ " />
        <RollingNumber value={1284} testID="r" />
      </CountifyProvider>,
    );
    expect(screen.getByText("R$ 1.284,5")).toHaveStyle({ fontVariant: ["tabular-nums"] });
    expect(screen.getByLabelText("1.284")).toBeOnTheScreen();
  });

  it("OverflowList resume o resto", async () => {
    await render(<OverflowList items={["a", "b", "c"]} maxVisible={1} renderItem={(x) => <Text key={x}>{x}</Text>} />);
    expect(screen.getByText("+2")).toBeOnTheScreen();
  });
});

describe("listas e abrir e fechar (React Native)", () => {
  it("DataList: termo e valor com tom", async () => {
    await render(<DataList><DataList.Item label="Variação" value="+8%" color="up" /></DataList>);
    expect(screen.getByText("+8%")).toHaveStyle({ color: l.up, fontFamily: "Roboto_500Medium", fontVariant: ["tabular-nums"] });
  });

  it("Timeline: o feito tem o marcador cheio", async () => {
    await render(<Timeline active={0}><Timeline.Item title="Instalada" /><Timeline.Item title="Conectada" /></Timeline>);
    expect(screen.getByText("Instalada")).toBeOnTheScreen();
  });

  it("Collapse: fechado some do leitor de tela", async () => {
    await render(<Collapse in={false} testID="c"><Text>Dentro</Text></Collapse>);
    expect(screen.getByTestId("c", { includeHiddenElements: true }).props).toMatchObject({ accessibilityElementsHidden: true });
    expect(screen.queryByText("Dentro")).toBeNull();
  });

  it("Spoiler mostra o botão só se o conteúdo passar da altura", async () => {
    await render(<Spoiler maxHeight={100}><Text>Texto longo</Text></Spoiler>);
    expect(screen.queryByRole("button")).toBeNull();
    await act(async () => {
      await fireEvent(screen.getByText("Texto longo").parent ?? screen.getByText("Texto longo"), "layout", layout(400));
    });
    const b = screen.getByRole("button", { name: "Mostrar mais" });
    await fireEvent.press(b);
    expect(screen.getByRole("button", { name: "Mostrar menos" })).toBeOnTheScreen();
  });

  it("Accordion: abre um por vez e anuncia expandido", async () => {
    const aoMudar = jest.fn();
    await render(
      <Accordion onChange={aoMudar}>
        <Accordion.Item value="a"><Accordion.Control>Contagem</Accordion.Control><Accordion.Panel>Sobre a contagem</Accordion.Panel></Accordion.Item>
        <Accordion.Item value="b"><Accordion.Control>Câmeras</Accordion.Control><Accordion.Panel>Sobre as câmeras</Accordion.Panel></Accordion.Item>
      </Accordion>,
    );
    const a = screen.getByRole("button", { name: /Contagem/ });
    expect(a).not.toBeExpanded();
    await fireEvent.press(a);
    expect(a).toBeExpanded();
    await fireEvent.press(screen.getByRole("button", { name: /Câmeras/ }));
    expect(a).not.toBeExpanded();
    expect(aoMudar).toHaveBeenLastCalledWith(["b"]);
  });
});
