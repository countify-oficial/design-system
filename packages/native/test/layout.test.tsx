import { CountifyProvider, createTheme } from "@countify-oficial/provider";
import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { AspectRatio, Center, Container, Flex, Grid, Group, SimpleGrid, Space, Stack } from "../src";
import { larguraDaTela } from "./tela";

afterEach(() => larguraDaTela(750));

describe("Stack, Group, Flex e Center (React Native)", () => {
  it("Stack: coluna com gap md; degrau da grade de 4", async () => {
    await render(<><Stack testID="a" /><Stack testID="b" gap={3} align="center" /></>);
    expect(screen.getByTestId("a")).toHaveStyle({ flexDirection: "column", gap: 16 });
    expect(screen.getByTestId("b")).toHaveStyle({ gap: 12, alignItems: "center" });
  });

  it("Group: linha que quebra, centrada; grow põe cada item numa View que cresce", async () => {
    await render(<Group testID="g" grow gap="xs"><Text>a</Text><Text>b</Text></Group>);
    expect(screen.getByTestId("g")).toHaveStyle({ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 4 });
    expect(screen.getByText("a").parent).toHaveStyle({ flexGrow: 1 });
  });

  it("Flex: linha por padrão, como na web; rowGap e columnGap", async () => {
    await render(<Flex testID="f" gap="sm" rowGap={5} />);
    expect(screen.getByTestId("f")).toHaveStyle({ flexDirection: "row", gap: 8, rowGap: 20 });
  });

  it("Center centraliza; inline encolhe ao conteúdo", async () => {
    await render(<Center testID="c" inline />);
    expect(screen.getByTestId("c")).toHaveStyle({ alignItems: "center", justifyContent: "center", alignSelf: "flex-start" });
  });
});

describe("Space, AspectRatio e Container (React Native)", () => {
  it("Space: altura e largura pelos tokens, fora do leitor de tela", async () => {
    await render(<Space testID="s" h="lg" w={2} />);
    expect(screen.getByTestId("s")).toHaveStyle({ height: 24, width: 8 });
    expect(screen.getByTestId("s").props).toMatchObject({ importantForAccessibility: "no" });
  });

  it("AspectRatio: proporção 1 por padrão", async () => {
    await render(<><AspectRatio testID="a" /><AspectRatio testID="b" ratio={16 / 9} /></>);
    expect(screen.getByTestId("a")).toHaveStyle({ aspectRatio: 1, overflow: "hidden" });
    expect(screen.getByTestId("b")).toHaveStyle({ aspectRatio: 16 / 9 });
  });

  it("Container: margem 20 no celular e 32 a partir de 768", async () => {
    await render(<Container testID="c" />);
    expect(screen.getByTestId("c")).toHaveStyle({ paddingHorizontal: 20 });
    await larguraDaTela(800);
    expect(screen.getByTestId("c")).toHaveStyle({ paddingHorizontal: 32 });
  });
});

describe("SimpleGrid e Grid (React Native)", () => {
  it("SimpleGrid: largura da célula pela quantidade de colunas do ponto de quebra", async () => {
    await render(<SimpleGrid testID="g" cols={{ base: 2, lg: 4 }} spacing="md"><Text>a</Text><Text>b</Text></SimpleGrid>);
    expect(screen.getByTestId("g")).toHaveStyle({ flexDirection: "row", flexWrap: "wrap", marginHorizontal: -8, rowGap: 16 });
    expect(screen.getByText("a").parent).toHaveStyle({ width: "50%", paddingHorizontal: 8 });
    await larguraDaTela(1300);
    expect(screen.getByText("a").parent).toHaveStyle({ width: "25%" });
  });

  it("Grid: 12 colunas e gap 24; Grid.Col pelo span (e a linha toda sem span)", async () => {
    await render(
      <Grid testID="g">
        <Grid.Col testID="c1" span={{ base: 12, sm: 4 }} />
        <Grid.Col testID="c2" />
      </Grid>,
    );
    expect(screen.getByTestId("g")).toHaveStyle({ marginHorizontal: -12, rowGap: 24 });
    expect(screen.getByTestId("c1")).toHaveStyle({ width: "100%", paddingHorizontal: 12 });
    await larguraDaTela(800);
    expect(screen.getByTestId("c1")).toHaveStyle({ width: `${(4 / 12) * 100}%` });
    expect(screen.getByTestId("c2")).toHaveStyle({ width: "100%" });
  });

  it("o tema muda o padrão (defaultProps) e o estilo (styles.root)", async () => {
    const theme = createTheme({ components: { Stack: { defaultProps: { gap: "xs" }, styles: { root: { padding: 4 } } } } });
    await render(<CountifyProvider theme={theme}><Stack testID="s" /></CountifyProvider>);
    expect(screen.getByTestId("s")).toHaveStyle({ gap: 4, padding: 4 });
  });
});
