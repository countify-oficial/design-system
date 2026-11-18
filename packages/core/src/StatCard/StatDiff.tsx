import { formatNumber, hasContent, useCountifyTheme, useMessages } from "@countify-oficial/provider";
import type { CSSProperties, ReactNode } from "react";
import { colorVar, cx } from "../styles";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden";
import classes from "./StatDiff.module.css";

/** As props da variação, iguais no StatCard e no Meter. */
export interface StatDiffProps {
  /** A variação: o sinal escolhe a seta (▲ ou ▼) e a cor; 0 fica sem seta, em texto 2. */
  diff?: number | undefined;
  /** O texto da comparação, depois da variação ("vs. qua."). */
  diffLabel?: ReactNode;
  /** Como mostrar a variação, sem o sinal. Padrão: o número no idioma do provider e "%" ("12%"). Ex.: `(n) => "1,0 pt"`. */
  diffFormat?: ((absolute: number) => string) | undefined;
  /** Quando subir é ruim (venda perdida, tempo de espera): alta em vermelho (down) e queda em verde (up). */
  invertDiff?: boolean | undefined;
}

/** A variação com seta, cor e o sentido lido pelo leitor de tela ("alta de 12%"). Parte do StatCard e do Meter. */
export function StatDiff({ diff, diffLabel, diffFormat, invertDiff, className, style }: StatDiffProps & { className?: string | undefined; style?: CSSProperties | undefined }) {
  const { locale } = useCountifyTheme();
  const messages = useMessages();
  if (diff === undefined || Number.isNaN(diff)) return null;
  const texto = diffFormat ? diffFormat(Math.abs(diff)) : `${formatNumber(Math.abs(diff), { locale })}%`;
  const sentido = diff > 0 ? "up" : diff < 0 ? "down" : "flat";
  const bom = invertDiff ? diff < 0 : diff > 0;
  const lido = sentido === "up" ? messages.increase(texto) : sentido === "down" ? messages.decrease(texto) : messages.noChange;
  return (
    <span
      data-trend={sentido}
      className={cx(classes["root"], className)}
      style={{ "--diff-color": colorVar(sentido === "flat" ? "text2" : bom ? "up" : "down"), ...style } as CSSProperties}
    >
      <span aria-hidden>{sentido === "up" ? "▲ " : sentido === "down" ? "▼ " : ""}{texto}</span>
      <VisuallyHidden>{lido}</VisuallyHidden>
      {hasContent(diffLabel) && <span className={classes["label"]}> {diffLabel}</span>}
    </span>
  );
}
