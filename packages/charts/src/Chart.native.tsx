import { useCountifyTheme } from "@countify-oficial/provider";
import { chart, fontSize, nativeFontFamily, palette, radius, space } from "@countify-oficial/tokens";
import { useState, type ReactNode } from "react";
import { Text as RNText, View, type GestureResponderEvent, type StyleProp, type ViewStyle } from "react-native";
import Svg, { Circle, Defs, Line, Path, Pattern, Polygon, Polyline, Text as SvgText } from "react-native-svg";
import { nearest, type Paint, type Scene, type Shape } from "./scene";
import { tableSummary, tipLines, type DataTable } from "./tables";

type Cores = ReturnType<typeof useCountifyTheme>["colors"];

/** Sem as chaves indefinidas (o TypeScript estrito não aceita undefined explícito nas props opcionais do SVG). */
const limpo = <T extends Record<string, unknown>>(o: T) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as { [K in keyof T]?: Exclude<T[K], undefined> };

/** Retângulo de cantos redondos como caminho (no react-native-svg, x e y do Rect estão obsoletos). */
function retangulo(x: number, y: number, w: number, h: number, rx = 0): string {
  const r = Math.max(0, Math.min(rx, w / 2, h / 2));
  const f = (v: number) => String(Math.round(v * 10) / 10);
  if (r === 0) return `M${f(x)},${f(y)}h${f(w)}v${f(h)}h${f(-w)}Z`;
  return `M${f(x + r)},${f(y)}h${f(w - 2 * r)}a${f(r)},${f(r)} 0 0 1 ${f(r)},${f(r)}v${f(h - 2 * r)}a${f(r)},${f(r)} 0 0 1 ${f(-r)},${f(r)}h${f(-(w - 2 * r))}a${f(r)},${f(r)} 0 0 1 ${f(-r)},${f(-r)}v${f(-(h - 2 * r))}a${f(r)},${f(r)} 0 0 1 ${f(r)},${f(-r)}Z`;
}

function useTinta(): (p: Paint | undefined) => string | undefined {
  const { colors: c, colorScheme } = useCountifyTheme();
  const series = chart.seriesShades[colorScheme];
  return (p) => (p === undefined ? undefined : p === "none" ? "none" : p === "hatch" ? "url(#hachura)" : p.startsWith("series-") ? palette.blue[series[Number(p.slice(7)) - 1] ?? 6] : c[p as keyof Cores]);
}

function forma(s: Shape, i: number, tinta: (p: Paint | undefined) => string | undefined): ReactNode {
  if (s.kind === "text") {
    return (
      <SvgText key={i} transform={[{ translateX: s.x }, { translateY: s.y }]} textAnchor={s.anchor ?? "middle"} {...limpo({ fill: tinta(s.fill) })} fontSize={s.size} fontFamily={nativeFontFamily[s.weight ?? 400]}>
        {s.text}
      </SvgText>
    );
  }
  const traco = limpo({ stroke: tinta(s.stroke), strokeWidth: s.strokeWidth, strokeDasharray: s.dash, strokeLinecap: s.cap, strokeLinejoin: s.join, opacity: s.opacity });
  if (s.kind === "line") return <Line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} {...traco} />;
  const fill = limpo({ fill: tinta(s.kind === "polyline" ? (s.fill ?? "none") : s.fill) });
  if (s.kind === "polyline") return <Polyline key={i} points={s.points} {...fill} {...traco} />;
  if (s.kind === "polygon") return <Polygon key={i} points={s.points} {...fill} {...traco} />;
  if (s.kind === "path") return <Path key={i} d={s.d} {...fill} {...traco} />;
  if (s.kind === "rect") return <Path key={i} d={retangulo(s.x, s.y, Math.max(0, s.width), Math.max(0, s.height), s.rx)} {...fill} {...traco} />;
  return <Circle key={i} cx={s.cx} cy={s.cy} r={s.r} {...fill} {...traco} />;
}

export interface ChartFrameProps {
  /** O que o gráfico mostra, numa frase; os valores vêm em seguida para o leitor de tela. */
  accessibilityLabel?: string | undefined;
  width?: number | undefined;
  height?: number | undefined;
  style?: StyleProp<ViewStyle>;
  testID?: string | undefined;
}

/**
 * Moldura dos gráficos no celular: mede a largura (onLayout) e desenha no react-native-svg; o leitor de tela ouve os valores.
 * Nos gráficos por índice, a dica aparece enquanto o dedo está no gráfico (como o Tooltip) e segue o arrasto.
 */
export function Grafico({ desenhar, tabela, accessibilityLabel, width, style, testID }: ChartFrameProps & { desenhar: (largura: number) => Scene; tabela: DataTable }) {
  const [medida, setMedida] = useState(0);
  const [ativo, setAtivo] = useState<number | null>(null);
  const tinta = useTinta();
  const { colors: c } = useCountifyTheme();
  const largura = width ?? medida;
  const cena = largura > 0 ? desenhar(largura) : null;
  const resumo = [accessibilityLabel, tableSummary(tabela)].filter(Boolean).join(". ");
  const { size, stroke } = chart.hatch;
  const dicas = cena?.tips;
  const i = dicas && ativo !== null ? Math.min(ativo, dicas.xs.length - 1) : null;
  const xa = i === null ? 0 : (dicas?.xs[i] ?? 0);
  // o Svg não recebe o toque: o locationX é sempre o da moldura
  const toque = dicas && {
    onStartShouldSetResponder: () => true,
    onResponderGrant: (e: GestureResponderEvent) => setAtivo(nearest(dicas.xs, e.nativeEvent.locationX)),
    onResponderMove: (e: GestureResponderEvent) => setAtivo(nearest(dicas.xs, e.nativeEvent.locationX)),
    onResponderRelease: () => setAtivo(null),
    onResponderTerminate: () => setAtivo(null),
  };
  return (
    <View testID={testID} accessible accessibilityRole="image" accessibilityLabel={resumo} onLayout={width === undefined ? (e) => setMedida(e.nativeEvent.layout.width) : undefined} style={style} {...toque}>
      {cena && (
        <Svg width={largura} height={cena.height} pointerEvents="none">
          {cena.hatch && (
            <Defs>
              <Pattern id="hachura" width={size} height={size} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <Path d={retangulo(0, 0, stroke, size)} fill={c.hatch} />
              </Pattern>
            </Defs>
          )}
          {cena.shapes.map((s, k) => forma(s, k, tinta))}
          {dicas && i !== null && forma({ kind: "line", x1: xa, y1: dicas.top, x2: xa, y2: dicas.bottom, stroke: "text3", strokeWidth: chart.stroke.grid }, cena.shapes.length, tinta)}
        </Svg>
      )}
      {dicas && i !== null && (
        // a mesma dica do Tooltip, do lado de dentro da linha-guia
        <View pointerEvents="none" style={[{ position: "absolute", top: dicas.top, paddingVertical: space[1], paddingHorizontal: space[2], borderRadius: radius.xs, backgroundColor: c.text }, xa < largura / 2 ? { left: xa + space[2] } : { right: largura - xa + space[2] }]}>
          {tipLines(tabela, i).map((l, k) => (
            <RNText key={k} style={{ color: c.bg, fontSize: fontSize.xs, fontFamily: nativeFontFamily[500] }}>
              {l}
            </RNText>
          ))}
        </View>
      )}
    </View>
  );
}

export interface ChartLegendItem {
  label: string;
  type?: "line" | "dashed" | "square" | "band" | undefined;
  color?: Paint | undefined;
}

/** Legenda: amostra (linha de 20 × 8 ou quadrado de 12) e o nome, em fileira. */
export function ChartLegend({ items, style }: { items: ChartLegendItem[]; style?: StyleProp<ViewStyle> }) {
  const tinta = useTinta();
  const { colors: c } = useCountifyTheme();
  const { lineWidth: lw, lineHeight: lh, square: q } = chart.legend;
  return (
    <View style={[{ flexDirection: "row", flexWrap: "wrap", columnGap: space[4], rowGap: space[2] }, style]}>
      {items.map((it) => {
        const tipo = it.type ?? "line";
        const cor = tinta(it.color ?? (tipo === "dashed" ? "text2" : tipo === "band" ? "divider" : "accent"));
        return (
          <View key={it.label} style={{ flexDirection: "row", alignItems: "center", gap: space[2] }}>
            {tipo === "square" || tipo === "band" ? (
              <Svg width={q} height={q}>
                <Path d={retangulo(0, 0, q, q, chart.bar.radius)} {...limpo({ fill: cor })} />
              </Svg>
            ) : (
              <Svg width={lw} height={lh}>
                <Line x1={1} y1={lh / 2} x2={lw - 1} y2={lh / 2} {...limpo({ stroke: cor, strokeDasharray: tipo === "dashed" ? chart.dash.forecast : undefined })} strokeWidth={tipo === "dashed" ? chart.stroke.line : chart.stroke.series} strokeLinecap="round" />
              </Svg>
            )}
            <RNText style={{ color: c.label, fontSize: fontSize.xs, fontFamily: nativeFontFamily[400] }}>{it.label}</RNText>
          </View>
        );
      })}
    </View>
  );
}
