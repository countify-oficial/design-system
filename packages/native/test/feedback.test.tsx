import { CountifyProvider } from "@countify-oficial/provider";
import { colors } from "@countify-oficial/tokens";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { StyleSheet, Text, type ViewStyle } from "react-native";
import {
  Alert, Avatar, Badge, Card, Divider, EmptyState, Icon, Indicator, Kbd, Notification, Paper, Progress, RingProgress,
  SemiCircleProgress, Skeleton, SkeletonLoader, ThemeIcon,
} from "../src";

const l = colors.light;

describe("Paper, Card e Divider (React Native)", () => {
  it("Paper: o anel vira borda fina; lg ganha sombra", async () => {
    await render(<><Paper testID="a" withBorder /><Paper testID="b" shadow="lg" /></>);
    expect(screen.getByTestId("a")).toHaveStyle({ backgroundColor: l.card, borderRadius: 16, borderWidth: 1, borderColor: l.divider });
    expect(screen.getByTestId("b")).toHaveStyle({ shadowOffset: { width: 0, height: 16 }, elevation: 16 });
  });

  it("Card: recuo 16; a seção primeira encosta em cima e dos lados", async () => {
    await render(<Card testID="c"><Card.Section testID="s"><Text>Foto</Text></Card.Section><Text>Lume</Text></Card>);
    expect(screen.getByTestId("c")).toHaveStyle({ padding: 16, gap: 16, borderWidth: 1 });
    expect(screen.getByTestId("s")).toHaveStyle({ marginHorizontal: -16, marginTop: -16 });
    expect(screen.getByTestId("s")).not.toHaveStyle({ marginBottom: -16 });
  });

  it("Divider com texto", async () => {
    await render(<Divider label="ou" testID="d" />);
    expect(screen.getByText("ou")).toHaveStyle({ color: l.text2, fontSize: 13 });
  });
});

describe("Badge, ThemeIcon, Avatar, Indicator e Kbd (React Native)", () => {
  it("Badge light gray, filled down e dot up", async () => {
    await render(<><Badge testID="a">parcial</Badge><Badge variant="filled" color="down" testID="b">3</Badge><Badge variant="dot" color="up">Online</Badge></>);
    expect(screen.getByTestId("a")).toHaveStyle({ backgroundColor: l.chip, height: 24, borderRadius: 8 });
    expect(screen.getByText("parcial")).toHaveStyle({ color: l.label, fontSize: 13 });
    expect(screen.getByTestId("b")).toHaveStyle({ backgroundColor: l.down, borderRadius: 12 });
    expect(screen.getByText("3")).toHaveStyle({ color: l.bg, fontFamily: "Roboto_700Bold" });
    expect(screen.getByText("Online")).toHaveStyle({ color: l.up, fontSize: 15 });
  });

  it("ThemeIcon passa a cor ao ícone", async () => {
    await render(<ThemeIcon testID="t" color="up"><Text testID="x">+</Text></ThemeIcon>);
    expect(screen.getByTestId("t", { includeHiddenElements: true })).toHaveStyle({ width: 40, height: 40, borderRadius: 12, backgroundColor: l.upTint });
  });

  it("Avatar: iniciais com o nome; foto que falha volta às iniciais", async () => {
    await render(<Avatar name="Ana Souza" src="https://x/ana.jpg" />);
    const a = screen.getByLabelText("Ana Souza");
    expect(a).toHaveStyle({ width: 40, borderRadius: 20 });
    const img = a.children[0];
    if (typeof img === "string" || !img) throw new Error("sem imagem");
    await fireEvent(img, "error");
    expect(screen.getByText("AS")).toHaveStyle({ fontFamily: "Roboto_700Bold", fontSize: 15 });
  });

  it("Indicator: contador vermelho no canto", async () => {
    await render(<Indicator label={3}><Icon name="bell" label="Avisos" /></Indicator>);
    // "end" segue a direção do texto (direita em português)
    expect(screen.getByTestId("indicator")).toHaveStyle({ position: "absolute", top: -12, end: -12, backgroundColor: l.down });
  });

  it("Kbd em letra de largura fixa", async () => {
    await render(<Kbd>Ctrl</Kbd>);
    expect(screen.getByText("Ctrl")).toHaveStyle({ fontFamily: "RobotoMono_500Medium", color: l.label });
  });
});

describe("Skeleton, SkeletonLoader e progresso (React Native)", () => {
  it("Skeleton: bloco cinza de 16, canto 4; visible={false} mostra o conteúdo", async () => {
    await render(<><Skeleton testID="s" animate={false} /><Skeleton visible={false}><Text>1.284</Text></Skeleton></>);
    expect(screen.getByTestId("s", { includeHiddenElements: true })).toHaveStyle({ height: 16, width: "100%", backgroundColor: l.divider, borderRadius: 4 });
    expect(screen.getByText("1.284")).toBeOnTheScreen();
  });

  it("SkeletonLoader: anuncia 'Carregando' ocupado; stat tem os blocos do mockup", async () => {
    const { container } = await render(<SkeletonLoader variant="stat" testID="sl" animate={false} />);
    expect(screen.getByLabelText("Carregando")).toBeBusy();
    const estilo = (n: { props: { style?: unknown } }) => StyleSheet.flatten(n.props.style as ViewStyle | undefined) ?? {};
    const blocos = container.queryAll((n) => typeof n.type === "string" && estilo(n).backgroundColor === l.divider);
    expect(blocos.map((b) => [estilo(b).width, estilo(b).height])).toEqual([[96, 16], [140, 32], [112, 16]]);
  });

  it("Progress: papel progressbar com valor limitado e meta", async () => {
    await render(<Progress value={130} marker={80} accessibilityLabel="Meta do mês" />);
    const p = screen.getByRole("progressbar", { name: "Meta do mês" });
    expect(p.props).toMatchObject({ accessibilityValue: { min: 0, max: 100, now: 100 } });
  });

  it("RingProgress e SemiCircleProgress no tamanho padrão (120 e 200)", async () => {
    await render(<><RingProgress testID="r" sections={[{ value: 40, color: "accent" }]} label={<Text>40%</Text>} /><SemiCircleProgress value={50} accessibilityLabel="Conversão" /></>);
    expect(screen.getByTestId("r")).toHaveStyle({ width: 120, height: 120 });
    expect(screen.getByText("40%")).toBeOnTheScreen();
    expect(screen.getByRole("progressbar", { name: "Conversão" })).toHaveStyle({ width: 200, height: 120 });
  });
});

describe("Alert, Notification e EmptyState (React Native)", () => {
  it("Alert de erro é alert; fechar chama onClose", async () => {
    const aoFechar = jest.fn();
    await render(<Alert testID="a" color="down" title="Não foi possível carregar" withCloseButton onClose={aoFechar}>Tente de novo.</Alert>);
    // o papel fica no contêiner sem agrupar (accessible) para o botão de fechar continuar alcançável
    expect(screen.getByTestId("a").props).toMatchObject({ accessibilityRole: "alert", accessibilityLiveRegion: "assertive" });
    expect(screen.getByText("Não foi possível carregar")).toHaveStyle({ fontFamily: "Roboto_500Medium", color: l.text });
    await fireEvent.press(screen.getByRole("button", { name: "Fechar" }));
    expect(aoFechar).toHaveBeenCalled();
  });

  it("Notification: cores invertidas e sombra", async () => {
    await render(<CountifyProvider defaultColorScheme="dark"><Notification testID="n" title="Análise salva" /></CountifyProvider>);
    expect(screen.getByTestId("n")).toHaveStyle({ backgroundColor: colors.dark.text, minHeight: 48 });
    expect(screen.getByText("Análise salva")).toHaveStyle({ color: colors.dark.bg });
  });

  it("EmptyState centralizado", async () => {
    await render(<EmptyState title="Nenhuma análise salva" description="Salve uma análise." />);
    expect(screen.getByText("Nenhuma análise salva")).toHaveStyle({ textAlign: "center", fontSize: 17 });
  });
});
