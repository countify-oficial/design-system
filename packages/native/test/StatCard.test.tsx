import { colors } from "@countify-oficial/tokens";
import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { Meter, StatCard } from "../src";

const l = colors.light;

describe("StatCard e Meter (React Native)", () => {
  it("StatCard: cartão com 4 entre as linhas, número de 28, afixos em 17 e a alta lida com o sentido", async () => {
    await render(<StatCard testID="c" label="Faturamento" prefix="R$" value="3.950" description="79 peças" diff={12} diffLabel="vs. qua." />);
    expect(screen.getByTestId("c")).toHaveStyle({ padding: 16, gap: 4, borderWidth: 1 });
    expect(screen.getByText("Faturamento")).toHaveStyle({ color: l.text2, fontSize: 15 });
    expect(screen.getByText("3.950")).toHaveStyle({ fontSize: 28, fontFamily: "Roboto_700Bold", fontVariant: ["tabular-nums"] });
    expect(screen.getByText("R$")).toHaveStyle({ color: l.text2, fontSize: 17 });
    expect(screen.getByText("79 peças")).toHaveStyle({ color: l.text2, fontSize: 15 });
    expect(screen.getByLabelText("alta de 12% vs. qua.")).toHaveStyle({ color: l.up, fontFamily: "Roboto_500Medium" });
  });

  it("StatCard: queda em down, invertDiff troca a cor, 0 fica em texto 2; help põe o ?", async () => {
    await render(
      <>
        <StatCard label="Ticket médio" value="158" diff={-3} />
        <StatCard label="Venda perdida estimada" value="420" diff={5} invertDiff help="Visitantes que saíram sem comprar × ticket médio." />
        <StatCard label="Saídas" value="161" diff={0} />
      </>,
    );
    expect(screen.getByLabelText("queda de 3%")).toHaveStyle({ color: l.down });
    expect(screen.getByLabelText("alta de 5%")).toHaveStyle({ color: l.down });
    expect(screen.getByLabelText("sem variação")).toHaveStyle({ color: l.text2 });
    expect(screen.getByRole("button", { name: "Ajuda: Venda perdida estimada" })).toBeOnTheScreen();
  });

  it("Meter: barra com a escala do app, o texto lido, o esperado e as legendas", async () => {
    await render(
      <Meter testID="m" label="Faturamento" value={71400} max={180000} marker={66000} startLabel="R$ 71.400 de R$ 180.000" endLabel="dia 11 de 30" footer="1.428 peças vendidas no mês" />,
    );
    expect(screen.getByTestId("m")).toHaveStyle({ gap: 12 });
    const barra = screen.getByRole("progressbar", { name: "Faturamento" });
    expect(barra.props).toMatchObject({ accessibilityValue: { min: 0, max: 180000, now: 71400, text: "39,7%" } });
    expect(screen.getByText("39,7%")).toHaveStyle({ fontSize: 28 });
    expect(screen.getByText("dia 11 de 30")).toHaveStyle({ color: l.text2 });
    expect(screen.getByText("1.428 peças vendidas no mês")).toHaveStyle({ fontSize: 13, color: l.text2 });
  });

  it("Meter lg: barra de 16 no fundo da divisória, variação em 17; valor preso na escala", async () => {
    await render(<Meter size="lg" value={200} max={180} diff={1} diffFormat={() => "1,0 pt"} accessibilityLabel="Conversão" startLabel={<Text>25 compraram</Text>} />);
    const barra = screen.getByRole("progressbar", { name: "Conversão" });
    expect(barra).toHaveStyle({ height: 16, borderRadius: 8, backgroundColor: l.divider });
    expect(barra.props).toMatchObject({ accessibilityValue: { now: 180, text: "100%" } });
    expect(screen.getByLabelText("alta de 1,0 pt")).toHaveStyle({ fontSize: 17 });
    expect(screen.getByText("25 compraram")).toBeOnTheScreen();
  });
});
