import { CountifyProvider } from "@countify-oficial/provider";
import { colors } from "@countify-oficial/tokens";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { ActionIcon, Button, FilterChip, HelpTip, Icon, Menu, PageHeader, Section } from "../src";

const l = colors.light;

describe("PageHeader, Section, HelpTip e FilterChip (React Native)", () => {
  it("PageHeader: linha de 60 com o título de 22 e as ações; sem voltar por padrão", async () => {
    await render(<PageHeader testID="p" title="Layouts"><ActionIcon accessibilityLabel="Novo layout"><Icon name="plus" /></ActionIcon></PageHeader>);
    expect(screen.getByTestId("p")).toHaveStyle({ flexDirection: "row", minHeight: 60, gap: 4 });
    expect(screen.getByRole("header", { name: "Layouts" })).toHaveStyle({ fontSize: 22, flex: 1 });
    expect(screen.getByRole("button", { name: "Novo layout" })).toBeOnTheScreen();
    expect(screen.queryByRole("button", { name: "Voltar" })).toBeNull();
  });

  it("PageHeader: o voltar redondo de 44 chama onBack; backLabel troca o nome", async () => {
    const aoVoltar = jest.fn();
    const { rerender } = await render(<PageHeader title="Usuário" onBack={aoVoltar} />);
    const voltar = screen.getByRole("button", { name: "Voltar" });
    expect(voltar).toHaveStyle({ width: 44, height: 44, borderRadius: 22, marginLeft: -12 });
    await fireEvent.press(voltar);
    expect(aoVoltar).toHaveBeenCalledTimes(1);
    await rerender(<PageHeader title="Usuário" backLabel="Ajustes" onBack={aoVoltar} />);
    expect(screen.getByRole("button", { name: "Ajustes" })).toBeOnTheScreen();
  });

  it("Section: título de 20, o ? com o nome do título, o texto à direita e o conteúdo", async () => {
    await render(<Section testID="s" title="Impressoras" help="As impressoras ligadas a este computador." aside="3 ligadas"><Text>conteúdo</Text></Section>);
    expect(screen.getByTestId("s")).toHaveStyle({ gap: 12 });
    expect(screen.getByRole("header", { name: "Impressoras" })).toHaveStyle({ fontSize: 20 });
    expect(screen.getByRole("button", { name: "Ajuda: Impressoras" })).toBeOnTheScreen();
    expect(screen.getByText("3 ligadas")).toHaveStyle({ color: l.text2, fontSize: 13, fontVariant: ["tabular-nums"] });
    expect(screen.getByText("conteúdo")).toBeOnTheScreen();
  });

  it("Section: sem help não há ?; a ação à direita entra como veio; helpLabel e o texto do provider dão o nome do ?", async () => {
    const { rerender } = await render(<Section title="Filial" order={3} aside={<Button variant="outline">Acrescentar</Button>} />);
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Acrescentar" })).toBeOnTheScreen();
    await rerender(<Section title="Filial" help="Onde a loja fica." helpLabel="Sobre a filial" />);
    expect(screen.getByRole("button", { name: "Sobre a filial" })).toBeOnTheScreen();
    await rerender(<CountifyProvider messages={{ help: "Help" }}><Section title={<Text>Filial</Text>} help="Onde a loja fica." /></CountifyProvider>);
    expect(screen.getByRole("button", { name: "Help" })).toBeOnTheScreen();
  });

  it("HelpTip: alvo de 44 que não aumenta a linha; o toque abre a explicação na folha e Fechar fecha", async () => {
    await render(<HelpTip label="Ajuda: Conversão">Vendas divididas pelas entradas.</HelpTip>);
    const botao = screen.getByRole("button", { name: "Ajuda: Conversão" });
    expect(botao).toHaveStyle({ width: 44, height: 44, borderRadius: 22, marginVertical: -10 });
    expect(screen.queryByText("Vendas divididas pelas entradas.")).toBeNull();
    await fireEvent.press(botao);
    expect(botao).toBeExpanded();
    expect(screen.getByText("Vendas divididas pelas entradas.")).toHaveStyle({ color: l.text, fontSize: 15 });
    await fireEvent.press(screen.getByRole("button", { name: "Fechar" }));
    expect(botao).toBeCollapsed();
    expect(screen.queryByText("Vendas divididas pelas entradas.")).toBeNull();
  });

  it("HelpTip: disabled não abre", async () => {
    await render(<HelpTip label="Ajuda" disabled>Explicação</HelpTip>);
    const botao = screen.getByRole("button", { name: "Ajuda" });
    expect(botao).toBeDisabled();
    await fireEvent.press(botao);
    expect(screen.queryByText("Explicação")).toBeNull();
  });

  it("FilterChip: mostra a escolha, marca o filtro aplicado e é o alvo de um Menu", async () => {
    const aoEscolher = jest.fn();
    await render(
      <Menu>
        <Menu.Target><FilterChip active>Marca · Lume</FilterChip></Menu.Target>
        <Menu.Dropdown><Menu.Item onPress={aoEscolher}>Todas as marcas</Menu.Item><Menu.Item>Lume</Menu.Item></Menu.Dropdown>
      </Menu>,
    );
    const chip = screen.getByRole("button", { name: "Marca · Lume" });
    expect(chip).toHaveStyle({ minHeight: 44, paddingHorizontal: 12, gap: 8, borderRadius: 12, backgroundColor: l.accentTint, borderColor: l.accent, borderWidth: 1.5 });
    expect(screen.getByText("Marca · Lume")).toHaveStyle({ color: l.accent, fontSize: 15 });
    await fireEvent.press(chip);
    // o expanded do Menu soma-se ao selected do chip, não o apaga
    expect(chip).toBeExpanded();
    expect(chip).toBeSelected();
    await fireEvent.press(screen.getByRole("menuitem", { name: "Todas as marcas" }));
    expect(aoEscolher).toHaveBeenCalledTimes(1);
  });

  it("FilterChip: neutro sem active; disabled não responde ao toque", async () => {
    const aoTocar = jest.fn();
    await render(<FilterChip disabled leftSection={<Icon name="search" testID="lupa" />} onPress={aoTocar}>Hoje</FilterChip>);
    const chip = screen.getByRole("button", { name: "Hoje" });
    expect(chip).toHaveStyle({ backgroundColor: l.card, borderColor: l.divider, borderWidth: 1, opacity: 0.4 });
    expect(screen.getByText("Hoje")).toHaveStyle({ color: l.text });
    expect(screen.getByTestId("lupa", { includeHiddenElements: true })).toBeOnTheScreen();
    expect(chip).not.toBeSelected();
    expect(chip).toBeDisabled();
    await fireEvent.press(chip);
    expect(aoTocar).not.toHaveBeenCalled();
  });
});
