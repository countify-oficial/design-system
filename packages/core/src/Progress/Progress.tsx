import { useComponentProps } from "@countify-oficial/provider";
import type { Tone } from "@countify-oficial/tokens";
import type { ComponentPropsWithRef } from "react";
import { toneVars, useStyles, type StylesApiProps } from "../styles";
import classes from "./Progress.module.css";

export interface ProgressProps
  extends StylesApiProps<"root" | "section" | "marker">, Omit<ComponentPropsWithRef<"div">, "className" | "style" | "children" | "color"> {
  /** De 0 a 100. */
  value: number;
  /** Tom da parte cheia. Padrão: accent. */
  color?: Tone | undefined;
  /** Onde fica a meta, de 0 a 100 (um traço sobre a barra). */
  marker?: number | undefined;
}

const limitar = (n: number) => Math.min(100, Math.max(0, n));

/** Barra de progresso, com meta opcional. Dê um nome com aria-label. */
export function Progress(props: ProgressProps) {
  const { value, color = "accent", marker, className, style, classNames, styles, ...rest } = useComponentProps("Progress", {}, props);
  const getStyles = useStyles("Progress", classes, { className, style, classNames, styles });
  const v = limitar(value);
  return (
    <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={v} {...rest} {...getStyles("root")}>
      <div {...getStyles("section", { "--progress-value": `${v}%`, ...toneVars(color) })} />
      {marker !== undefined && <div {...getStyles("marker", { "--progress-marker": `${limitar(marker)}%` })} />}
    </div>
  );
}
