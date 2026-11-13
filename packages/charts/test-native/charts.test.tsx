import { render, screen } from "@testing-library/react-native";
import { BarChart, ChartLegend, Heatmap, LineChart } from "../src/index.native";

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
});
