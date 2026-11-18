import { VisuallyHidden } from "@countify-oficial/core";
import { useId } from "@countify-oficial/hooks";
import { useMessages } from "@countify-oficial/provider";
import { chart, fontWeight, space } from "@countify-oficial/tokens";
import { useEffect, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { nearest, type Paint, type Scene, type Shape } from "./scene";
import { tipLines, type DataTable } from "./tables";
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

/**
 * Moldura dos gráficos: mede a largura, desenha a cena e põe a tabela de dados escondida para o leitor de tela.
 * Nos gráficos por índice (linha, área, barras, combinado), a dica: o mouse ou o dedo escolhe o ponto mais perto; no
 * teclado, o gráfico é um controle deslizante (setas, Home, End; Esc fecha) que fala os valores do ponto.
 */
export function Grafico({ desenhar, tabela, "aria-label": rotulo, width, className, style }: ChartFrameProps & { desenhar: (largura: number) => Scene; tabela: DataTable }) {
  const [caixa, setCaixa] = useState<HTMLElement | null>(null);
  const [medida, setMedida] = useState(0);
  const hachura = useId();
  const messages = useMessages();
  const [ativo, setAtivo] = useState<number | null>(null);
  useEffect(() => {
    if (!caixa || width !== undefined) return;
    const ro = new ResizeObserver(() => setMedida(caixa.clientWidth));
    ro.observe(caixa);
    return () => ro.disconnect();
  }, [caixa, width]);
  const largura = width ?? medida;
  const cena = largura > 0 ? desenhar(largura) : null;
  const { size, stroke } = chart.hatch;
  const dicas = cena?.tips;
  const i = dicas && ativo !== null ? Math.min(ativo, dicas.xs.length - 1) : null;
  const xa = i === null ? 0 : (dicas?.xs[i] ?? 0);
  // no Sankey a dica sai no meio do fluxo; nos outros, no topo da linha-guia
  const ya = i === null ? 0 : (dicas?.ys?.[i] ?? dicas?.top ?? 0);
  const escolher = (e: PointerEvent<HTMLElement>) => {
    if (!dicas) return;
    const r = e.currentTarget.getBoundingClientRect();
    setAtivo(nearest(dicas.xs, e.clientX - r.left, dicas.ys, e.clientY - r.top));
  };
  const tecla = (e: KeyboardEvent) => {
    if (!dicas) return;
    const ultimo = dicas.xs.length - 1;
    const passos: Partial<Record<string, number | null>> = { ArrowRight: (i ?? -1) + 1, ArrowUp: (i ?? -1) + 1, ArrowLeft: (i ?? 1) - 1, ArrowDown: (i ?? 1) - 1, Home: 0, End: ultimo, Escape: null };
    const novo = passos[e.key];
    if (novo === undefined) return;
    if (novo === null) {
      setAtivo(null);
      return;
    }
    e.preventDefault();
    setAtivo(Math.max(0, Math.min(ultimo, novo)));
  };
  const desenho = cena && (
    <svg width={largura} height={cena.height} viewBox={`0 0 ${String(largura)} ${String(cena.height)}`} aria-hidden className={classes["svg"]}>
      {cena.hatch && (
        <defs>
          <pattern id={hachura} width={size} height={size} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width={stroke} height={size} style={{ fill: "var(--cf-color-hatch)" }} />
          </pattern>
        </defs>
      )}
      {cena.shapes.map((s, k) => forma(s, k, hachura))}
      {dicas?.marks && i !== null && dicas.marks[i] && forma(dicas.marks[i], cena.shapes.length, hachura)}
      {dicas && !dicas.ys && i !== null && forma({ kind: "line", x1: xa, y1: dicas.top, x2: xa, y2: dicas.bottom, stroke: "text3", strokeWidth: chart.stroke.grid }, cena.shapes.length, hachura)}
    </svg>
  );
  return (
    <figure ref={setCaixa} aria-label={rotulo} className={[classes["root"], className].filter(Boolean).join(" ")} style={style}>
      {dicas ? (
        <div
          role="slider"
          tabIndex={0}
          aria-label={dicas.ys ? messages.chartFlow : messages.chartPoint}
          aria-valuemin={0}
          aria-valuemax={dicas.xs.length - 1}
          aria-valuenow={i ?? 0}
          aria-valuetext={tipLines(tabela, i ?? 0).join(", ")}
          className={classes["explore"]}
          onPointerDown={escolher}
          onPointerMove={escolher}
          onPointerLeave={() => setAtivo(null)}
          onFocus={() => setAtivo((a) => a ?? 0)}
          onBlur={() => setAtivo(null)}
          onKeyDown={tecla}
        >
          {desenho}
          {i !== null && (
            // a dica fica do lado de dentro da linha-guia: à direita dela na 1ª metade, à esquerda na 2ª
            <div aria-hidden className={classes["tip"]} style={xa < largura / 2 ? { top: ya, left: xa + space[2] } : { top: ya, right: largura - xa + space[2] }}>
              {tipLines(tabela, i).map((l, k) => (
                <div key={k}>{l}</div>
              ))}
            </div>
          )}
        </div>
      ) : (
        desenho
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
