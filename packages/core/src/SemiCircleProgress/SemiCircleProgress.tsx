import { useComponentProps } from "@countify-oficial/provider";
import { ringProgress, type ColorRole } from "@countify-oficial/tokens";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { kebab, useStyles, type StylesApiProps } from "../styles";
import classes from "./SemiCircleProgress.module.css";

export interface SemiCircleProgressProps
  extends StylesApiProps<"root" | "svg" | "track" | "label">, Omit<ComponentPropsWithRef<"div">, "className" | "style" | "children" | "color"> {
  /** De 0 a 100. */
  value: number;
  /** Papel de cor da parte cheia. Padrão: accent. */
  color?: ColorRole | undefined;
  /** Largura em px. Padrão: 200. */
  size?: number | undefined;
  /** Espessura em px. Padrão: 1/5 da largura. */
  thickness?: number | undefined;
  /** Arco para cima (up) ou para baixo (down). Padrão: up. */
  orientation?: "up" | "down" | undefined;
  /** Texto junto da base do arco. */
  label?: ReactNode;
}

/** Meio anel de progresso (de 0 a 100). Dê um nome com aria-label. */
export function SemiCircleProgress(props: SemiCircleProgressProps) {
  const { value, color = "accent", size = ringProgress.semicircleSize, thickness, orientation = "up", label, className, style, classNames, styles, ...rest } =
    useComponentProps("SemiCircleProgress", {}, props);
  const getStyles = useStyles("SemiCircleProgress", classes, { className, style, classNames, styles });
  const espessura = thickness ?? size * ringProgress.thicknessRatio;
  const r = (size - espessura) / 2;
  const altura = size / 2 + espessura / 2;
  const meio = Math.PI * r;
  const v = Math.min(100, Math.max(0, value));
  // arco de cima, da esquerda para a direita; "down" espelha na vertical
  const y = orientation === "up" ? altura - espessura / 2 : espessura / 2;
  const varredura = orientation === "up" ? 1 : 0;
  const arco = `M ${espessura / 2} ${y} A ${r} ${r} 0 0 ${varredura} ${size - espessura / 2} ${y}`;
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={v}
      {...rest}
      data-orientation={orientation}
      {...getStyles("root", { "--semi-width": `${size}px`, "--semi-height": `${altura}px` })}
    >
      <svg viewBox={`0 0 ${size} ${altura}`} width={size} height={altura} aria-hidden {...getStyles("svg")}>
        <path d={arco} fill="none" strokeWidth={espessura} {...getStyles("track")} />
        <path
          d={arco}
          fill="none"
          strokeWidth={espessura}
          strokeDasharray={`${(v / 100) * meio} ${meio}`}
          style={{ stroke: `var(--cf-color-${kebab(color)})` }}
        />
      </svg>
      {label !== undefined && <div {...getStyles("label")}>{label}</div>}
    </div>
  );
}
