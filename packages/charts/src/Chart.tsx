import { VisuallyHidden } from "@countify-oficial/core";
import { useId } from "@countify-oficial/hooks";
import { chart, fontWeight } from "@countify-oficial/tokens";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import type { Paint, Scene, Shape } from "./scene";
import type { DataTable } from "./tables";
import classes from "./Chart.module.css";

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
const tinta = (p: Paint | undefined, hachura: string): string | undefined =>
  p === undefined ? undefined : p === "none" ? "none" : p === "hatch" ? `url(#${hachura})` : p.startsWith("series-") ? `var(--cf-chart-${p})` : `var(--cf-color-${kebab(p)})`;

function forma(s: Shape, i: number, hachura: string): ReactNode {
  if (s.kind === "text") {
    return (
      <text key={i} x={s.x} y={s.y} textAnchor={s.anchor ?? "middle"} style={{ fill: tinta(s.fill, hachura), fontSize: s.size, fontWeight: s.weight ?? fontWeight.regular }}>
        {s.text}
      </text>
    );
  }
  const estilo: CSSProperties = { stroke: tinta(s.stroke, hachura), strokeWidth: s.strokeWidth, strokeDasharray: s.dash, strokeLinecap: s.cap, strokeLinejoin: s.join, opacity: s.opacity };
  if (s.kind === "line") return <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} style={estilo} />;
  if (s.kind === "polyline") return <polyline key={i} points={s.points} style={{ ...estilo, fill: tinta(s.fill ?? "none", hachura) }} />;
  if (s.kind === "polygon") return <polygon key={i} points={s.points} style={{ ...estilo, fill: tinta(s.fill, hachura) }} />;
  if (s.kind === "path") return <path key={i} d={s.d} style={{ ...estilo, fill: tinta(s.fill, hachura) }} />;
  if (s.kind === "rect") return <rect key={i} x={s.x} y={s.y} width={Math.max(0, s.width)} height={Math.max(0, s.height)} rx={s.rx} style={{ ...estilo, fill: tinta(s.fill, hachura) }} />;
  return <circle key={i} cx={s.cx} cy={s.cy} r={s.r} style={{ ...estilo, fill: tinta(s.fill, hachura) }} />;
}

export interface ChartFrameProps {
  /** O que o gráfico mostra, numa frase ("Entradas por hora: 1.428 até agora, 12% acima do previsto"). */
  "aria-label"?: string | undefined;
  /** Largura fixa; sem ela, ocupa a largura do lugar. */
  width?: number | undefined;
  /** Altura (a padrão vem de cada gráfico). */
  height?: number | undefined;
  className?: string | undefined;
  style?: CSSProperties | undefined;
}

/** Moldura dos gráficos: mede a largura, desenha a cena e põe a tabela de dados escondida para o leitor de tela. */
export function Grafico({ desenhar, tabela, "aria-label": rotulo, width, className, style }: ChartFrameProps & { desenhar: (largura: number) => Scene; tabela: DataTable }) {
  const [caixa, setCaixa] = useState<HTMLElement | null>(null);
  const [medida, setMedida] = useState(0);
  const hachura = useId();
  useEffect(() => {
    if (!caixa || width !== undefined) return;
    const ro = new ResizeObserver(() => setMedida(caixa.clientWidth));
    ro.observe(caixa);
    return () => ro.disconnect();
  }, [caixa, width]);
  const largura = width ?? medida;
  const cena = largura > 0 ? desenhar(largura) : null;
  const { size, stroke } = chart.hatch;
  return (
    <figure ref={setCaixa} aria-label={rotulo} className={[classes["root"], className].filter(Boolean).join(" ")} style={style}>
      {cena && (
        <svg width={largura} height={cena.height} viewBox={`0 0 ${String(largura)} ${String(cena.height)}`} aria-hidden className={classes["svg"]}>
          {cena.hatch && (
            <defs>
              <pattern id={hachura} width={size} height={size} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width={stroke} height={size} style={{ fill: "var(--cf-color-hatch)" }} />
              </pattern>
            </defs>
          )}
          {cena.shapes.map((s, i) => forma(s, i, hachura))}
        </svg>
      )}
      <VisuallyHidden>
        <table>
          {rotulo && <caption>{rotulo}</caption>}
          {tabela.head.some(Boolean) && (
            <thead>
              <tr>{tabela.head.map((h, i) => (h ? <th key={i} scope="col">{h}</th> : <td key={i} />))}</tr>
            </thead>
          )}
          <tbody>
            {tabela.rows.map((r, i) => (
              <tr key={i}>{r.map((c, j) => (j === 0 ? <th key={j} scope="row">{c}</th> : <td key={j}>{c}</td>))}</tr>
            ))}
          </tbody>
        </table>
      </VisuallyHidden>
    </figure>
  );
}

export interface ChartLegendItem {
  label: string;
  /** line: a série; dashed: previsto ou período anterior; square: barras e fatias; band: faixa normal. */
  type?: "line" | "dashed" | "square" | "band" | undefined;
  /** Padrão: accent (line, square), text2 (dashed), divider (band). */
  color?: Paint | undefined;
}

/** Legenda dos gráficos: amostra (linha de 20 × 8 ou quadrado de 12) e o nome, em fileira. */
export function ChartLegend({ items, className, style }: { items: ChartLegendItem[]; className?: string | undefined; style?: CSSProperties | undefined }) {
  const { lineWidth: lw, lineHeight: lh, square: q } = chart.legend;
  return (
    <ul className={[classes["legend"], className].filter(Boolean).join(" ")} style={style}>
      {items.map((it) => {
        const tipo = it.type ?? "line";
        const cor = tinta(it.color ?? (tipo === "dashed" ? "text2" : tipo === "band" ? "divider" : "accent"), "");
        return (
          <li key={it.label} className={classes["legendItem"]}>
            {tipo === "square" || tipo === "band" ? (
              <svg width={q} height={q} aria-hidden>
                <rect width={q} height={q} rx={chart.bar.radius} style={{ fill: cor }} />
              </svg>
            ) : (
              <svg width={lw} height={lh} aria-hidden>
                <line x1={1} y1={lh / 2} x2={lw - 1} y2={lh / 2} style={{ stroke: cor, strokeWidth: tipo === "dashed" ? chart.stroke.line : chart.stroke.series, strokeDasharray: tipo === "dashed" ? chart.dash.forecast : undefined, strokeLinecap: "round" }} />
              </svg>
            )}
            {it.label}
          </li>
        );
      })}
    </ul>
  );
}
