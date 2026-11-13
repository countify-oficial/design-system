import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { AppShell, Button, Marquee, ScrollArea, Scroller, Toolbar } from "../src";
import { larguraDaTela } from "./tela";

describe("rolagem, faixa, barra e moldura (React Native)", () => {
  it("ScrollArea avisa a posição; Scroller é horizontal", async () => {
    const aoRolar = jest.fn();
    await render(<ScrollArea testID="area" onScrollPositionChange={aoRolar}><Text>Conteúdo</Text></ScrollArea>);
    await fireEvent.scroll(screen.getByTestId("area"), { nativeEvent: { contentOffset: { x: 0, y: 40 }, contentSize: { width: 100, height: 400 }, layoutMeasurement: { width: 100, height: 100 } } });
    expect(aoRolar).toHaveBeenLastCalledWith({ x: 0, y: 40 });
    await render(<Scroller testID="fila"><Text>A</Text></Scroller>);
    expect(screen.getByTestId("fila").props.horizontal).toBe(true);
  });

  it("Marquee: só uma cópia para o leitor de tela", async () => {
    await render(<Marquee accessibilityLabel="Novidades"><Text>Fortaleza +12%</Text></Marquee>);
    expect(screen.getByLabelText("Novidades")).toBeOnTheScreen();
    expect(screen.getAllByText("Fortaleza +12%", { includeHiddenElements: true })).toHaveLength(2);
    expect(screen.getAllByText("Fortaleza +12%")).toHaveLength(1);
  });

  it("Toolbar com nome", async () => {
    await render(<Toolbar accessibilityLabel="Ações"><Button>Exportar</Button></Toolbar>);
    // o RNTL só acha por papel o que é accessible; a barra em si não é (os botões dentro é que são)
    expect(screen.getByLabelText("Ações").props.accessibilityRole).toBe("toolbar");
  });

  const shell = (aoTocar: () => void) => (
    <AppShell safeAreaInsets={{ top: 48, bottom: 36 }}>
      <AppShell.Header logo={<Text>countify</Text>}>
        <AppShell.NavItem icon="dashboard" label="Painel" active />
        <AppShell.NavItem icon="bell" label="Avisos" />
      </AppShell.Header>
      <AppShell.Main><Text>Conteúdo</Text></AppShell.Main>
      <AppShell.TabBar>
        <AppShell.NavItem icon="dashboard" label="Painel" active />
        <AppShell.NavItem icon="bell" label="Avisos" onPress={aoTocar} />
      </AppShell.TabBar>
    </AppShell>
  );

  it("AppShell: abas embaixo no celular; cabeçalho no tablet", async () => {
    const tocou = jest.fn();
    await larguraDaTela(390);
    await render(shell(tocou));
    expect(screen.getByRole("tab", { name: "Painel" })).toBeSelected();
    expect(screen.queryByRole("menuitem")).toBeNull();
    await fireEvent.press(screen.getByRole("tab", { name: "Avisos" }));
    expect(tocou).toHaveBeenCalled();
    await larguraDaTela(1024);
    expect(screen.queryByRole("tab")).toBeNull();
    expect(screen.getByRole("menuitem", { name: "Painel" })).toBeSelected();
    await larguraDaTela(750);
  });
});
