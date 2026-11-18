import { fireEvent, render, screen } from "@testing-library/react-native";
import { BarChart, ChartLegend, ComboChart, drawSankey, Heatmap, LineChart, SankeyChart } from "../src/index.native";

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

  it("Sankey: o resumo traz cada fluxo e o dedo escolhe o fluxo mais perto", async () => {
    const dados = {
      nodes: [{ id: "v", label: "Visitantes" }, { id: "e", label: "Entraram" }, { id: "c", label: "Compraram" }],
      links: [{ source: "v", target: "e", value: 400 }, { source: "e", target: "c", value: 80 }],
    };
    await render(<SankeyChart width={300} {...dados} accessibilityLabel="Visitas" />);
    const g = screen.getByRole("image");
    expect(g.props.accessibilityLabel).toBe("Visitas. Visitantes Entraram 400; Entraram Compraram 80");
    const { tips } = drawSankey(dados, 300);
    await fireEvent(g, "responderGrant", { nativeEvent: { locationX: tips?.xs[1], locationY: tips?.ys?.[1] } });
    expect(screen.getByText("Destino: Compraram")).toBeOnTheScreen();
    await fireEvent(g, "responderRelease");
    expect(screen.queryByText("Destino: Compraram")).toBeNull();
  });
});
