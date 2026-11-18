import { fireEvent, render, screen } from "@testing-library/react-native";
import { BarChart, ChartLegend, ComboChart, Heatmap, LineChart } from "../src/index.native";

describe("gráficos (React Native)", () => {
  it("o leitor de tela ouve o resumo e os valores", async () => {
    await render(<LineChart width={300} accessibilityLabel="Entradas por hora" labels={["8h", "9h"]} actual={[10, 20]} />);
    const g = screen.getByRole("image");
    expect(g.props.accessibilityLabel).toBe("Entradas por hora. 8h 10; 9h 20");
  });

  it("barras, mapa de calor e legenda desenham", async () => {
    await render(
      <>
        <BarChart width={300} values={[1, 2]} highlight="max" accessibilityLabel="Barras" />
        <Heatmap width={300} rows={["seg"]} columns={["9h"]} values={[[null]]} accessibilityLabel="Mapa" />
        <ChartLegend items={[{ label: "Real" }, { label: "Previsto", type: "dashed" }]} />
      </>,
    );
    expect(screen.getByLabelText(/^Mapa\. seg fechado/)).toBeOnTheScreen();
    expect(screen.getByText("Previsto")).toBeOnTheScreen();
  });

  it("várias séries e combinado: o resumo traz cada série", async () => {
    await render(
      <>
        <BarChart width={300} labels={["seg"]} series={[{ name: "Orla", values: [10] }, { name: "Jardins", values: [12] }]} accessibilityLabel="Lojas" />
        <ComboChart width={300} labels={["seg"]} values={[100]} lines={[{ name: "Meta", values: [120], dashed: true }]} accessibilityLabel="Vendas" />
      </>,
    );
    expect(screen.getByLabelText("Lojas. seg 10 12")).toBeOnTheScreen();
    expect(screen.getByLabelText("Vendas. seg 100 120")).toBeOnTheScreen();
  });

  it("a dica aparece enquanto o dedo está no gráfico e segue o arrasto", async () => {
    await render(<BarChart width={300} labels={["9h", "10h", "11h"]} values={[3, 9, 4]} accessibilityLabel="Barras" />);
    const g = screen.getByRole("image");
    await fireEvent(g, "responderGrant", { nativeEvent: { locationX: 10 } });
    expect(screen.getByText("9h")).toBeOnTheScreen();
    await fireEvent(g, "responderMove", { nativeEvent: { locationX: 290 } });
    expect(screen.getByText("11h")).toBeOnTheScreen();
    await fireEvent(g, "responderRelease");
    expect(screen.queryByText("11h")).toBeNull();
  });
});
