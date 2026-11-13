import { useComponentProps } from "@countify-oficial/provider";
import type { Tone } from "@countify-oficial/tokens";
import { useRef, useState, type ComponentPropsWithRef, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { toneVars, useStyles, type CssVars, type StylesApiProps } from "../styles";
import classes from "./Slider.module.css";

export interface SliderMark {
  value: number;
  label?: ReactNode;
}

export type SliderPart = "root" | "track" | "bar" | "thumb" | "mark" | "markLabel";

export interface SliderCommonProps extends StylesApiProps<SliderPart>, Omit<ComponentPropsWithRef<"div">, "className" | "style" | "onChange" | "defaultValue" | "color"> {
  /** Padrão: 0. */
  min?: number | undefined;
  /** Padrão: 100. */
  max?: number | undefined;
  /** Padrão: 1. */
  step?: number | undefined;
  disabled?: boolean | undefined;
  /** Tom da barra e da bolinha. Padrão: accent. */
  color?: Tone | undefined;
  /** Pontos no trilho, com texto embaixo. */
  marks?: SliderMark[] | undefined;
  /** O texto que o leitor de tela lê para um valor ("21 %"). */
  getValueText?: ((value: number) => string) | undefined;
  name?: string | undefined;
}

interface Props extends SliderCommonProps {
  nome: string;
  valores: number[];
  aoMudar: (valores: number[]) => void;
  aoTerminar?: ((valores: number[]) => void) | undefined;
  /** nome de cada bolinha para o leitor de tela */
  nomes: (string | undefined)[];
  /** espaço mínimo entre duas bolinhas */
  minRange?: number | undefined;
  /** bar: barra entre o começo (ou a primeira bolinha) e a bolinha; hue e alpha: trilho de cor */
  tipo: "bar" | "hue" | "alpha";
  /** cor da bolinha (matiz e transparência) */
  corDaBolinha?: string | undefined;
  /** cor do fim do trilho de transparência */
  corDoTrilho?: string | undefined;
}

const casas = (n: number) => (String(n).split(".")[1] ?? "").length;

/** A base dos sliders lineares: uma ou duas bolinhas, ponteiro e teclado. */
export function SliderBase({
  nome, valores, aoMudar, aoTerminar, nomes, minRange = 0, tipo, corDaBolinha, corDoTrilho,
  min = 0, max = 100, step = 1, disabled, color = "accent", marks, getValueText, name, className, style, classNames, styles, ...rest
}: Props) {
  const p = useComponentProps(nome, {}, { className, style, classNames, styles });
  const getStyles = useStyles(nome, classes, p);
  const trilho = useRef<HTMLDivElement>(null);
  const [arrastando, setArrastando] = useState<number | null>(null);
  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  const encaixar = (v: number) => Math.min(max, Math.max(min, Number((Math.round((v - min) / step) * step + min).toFixed(casas(step)))));
  const definir = (i: number, v: number, fim = false) => {
    const outros = valores.filter((_, k) => k !== i);
    let novo = encaixar(v);
    // as bolinhas não se cruzam: ficam a minRange uma da outra
    if (valores.length === 2) novo = i === 0 ? Math.min(novo, (outros[0] ?? max) - minRange) : Math.max(novo, (outros[0] ?? min) + minRange);
    const lista = valores.map((x, k) => (k === i ? novo : x));
    aoMudar(lista);
    if (fim) aoTerminar?.(lista);
  };
  const doPonto = (x: number) => {
    const r = trilho.current?.getBoundingClientRect();
    if (!r || r.width === 0) return min;
    return min + ((x - r.left) / r.width) * (max - min);
  };
  const aoApertar = (e: PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    const v = doPonto(e.clientX);
    const i = valores.length === 2 ? (Math.abs(v - (valores[0] ?? 0)) <= Math.abs(v - (valores[1] ?? 0)) ? 0 : 1) : 0;
    e.currentTarget.setPointerCapture(e.pointerId);
    setArrastando(i);
    definir(i, v);
    e.currentTarget.querySelectorAll<HTMLElement>("[role=slider]")[i]?.focus();
  };
  const aoTeclar = (i: number, e: KeyboardEvent<HTMLDivElement>) => {
    const v = valores[i] ?? min;
    const grande = Math.max(step, (max - min) / 10);
    const destino = { ArrowRight: v + step, ArrowUp: v + step, ArrowLeft: v - step, ArrowDown: v - step, PageUp: v + grande, PageDown: v - grande, Home: min, End: max }[e.key];
    if (destino === undefined || disabled) return;
    e.preventDefault();
    definir(i, destino, true);
  };
  const barra = valores.length === 2 ? { "--slider-from": `${pct(valores[0] ?? min)}%`, "--slider-to": `${pct(valores[1] ?? max)}%` } : { "--slider-from": "0%", "--slider-to": `${pct(valores[0] ?? min)}%` };
  const vars: CssVars = { ...toneVars(color), ...(corDoTrilho ? { "--slider-color": corDoTrilho } : {}) };
  return (
    <div
      {...rest}
      data-kind={tipo}
      data-disabled={disabled || undefined}
      data-with-marks={marks?.some((m) => m.label !== undefined) || undefined}
      onPointerDown={aoApertar}
      onPointerMove={(e) => arrastando !== null && definir(arrastando, doPonto(e.clientX))}
      onPointerUp={() => {
        if (arrastando !== null) aoTerminar?.(valores);
        setArrastando(null);
      }}
      {...getStyles("root", vars)}
    >
      <div ref={trilho} {...getStyles("track")}>
        {tipo === "bar" && <div {...getStyles("bar", barra)} />}
        {marks?.map((m) => <span key={m.value} {...getStyles("mark", { "--mark-position": `${pct(m.value)}%` })} />)}
        {valores.map((v, i) => (
          <div
            key={i}
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-label={nomes[i]}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={v}
            aria-valuetext={getValueText?.(v)}
            aria-orientation="horizontal"
            aria-disabled={disabled || undefined}
            onKeyDown={(e) => aoTeclar(i, e)}
            {...getStyles("thumb", { "--thumb-position": `${pct(v)}%`, ...(corDaBolinha ? { "--thumb-color": corDaBolinha } : {}) })}
          />
        ))}
      </div>
      {marks?.filter((m) => m.label !== undefined).map((m) => (
        <span key={`r${m.value}`} aria-hidden {...getStyles("markLabel", { "--mark-position": `${pct(m.value)}%` })}>{m.label}</span>
      ))}
      {name !== undefined && valores.map((v, i) => <input key={i} type="hidden" name={valores.length === 2 ? `${name}[${i}]` : name} value={v} />)}
    </div>
  );
}

