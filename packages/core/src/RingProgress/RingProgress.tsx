import { useComponentProps } from "@countify-oficial/provider";
import { ringProgress, type ColorRole } from "@countify-oficial/tokens";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { kebab, useStyles, type StylesApiProps } from "../styles";
import classes from "./RingProgress.module.css";

export interface RingProgressSection {
  /** De 0 a 100 (a soma das partes não passa de 100). */
  value: number;
  /** Papel de cor. */
  color: ColorRole;
  /** Nome da parte (vira <title>, lido pelo leitor de tela). */
  label?: string | undefined;
}

export interface RingProgressProps
  extends StylesApiProps<"root" | "svg" | "track" | "label">, Omit<ComponentPropsWithRef<"div">, "className" | "style" | "children"> {
  sections: RingProgressSection[];
  /** Lado em px. Padrão: 120. */
  size?: number | undefined;
  /** Espessura do anel em px. Padrão: 1/5 do tamanho, como o anel da marca. */
  thickness?: number | undefined;
  /** No centro do anel (um número, por exemplo). */
  label?: ReactNode;
  /** Pontas arredondadas. */
  roundCaps?: boolean | undefined;
}

/** Anel com uma ou mais partes (de 0 a 100), com texto no centro. */
export function RingProgress(props: RingProgressProps) {
  const { sections, size = ringProgress.size, thickness, label, roundCaps, className, style, classNames, styles, ...rest } =
    useComponentProps("RingProgress", {}, props);
  const getStyles = useStyles("RingProgress", classes, { className, style, classNames, styles });
  const espessura = thickness ?? size * ringProgress.thicknessRatio;
  const r = (size - espessura) / 2;
  const volta = 2 * Math.PI * r;
  const comprimentos = sections.map((s) => (Math.min(100, Math.max(0, s.value)) / 100) * volta);
  // cada parte começa onde a anterior terminou
  const inicios = comprimentos.map((_, i) => comprimentos.slice(0, i).reduce((a, b) => a + b, 0));
  return (
    <div {...rest} {...getStyles("root", { "--ring-size": `${size}px` })}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden={sections.every((s) => !s.label) || undefined} {...getStyles("svg")}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={espessura} {...getStyles("track")} />
        {sections.map((s, i) => (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              strokeWidth={espessura}
              strokeLinecap={roundCaps ? "round" : "butt"}
              strokeDasharray={`${comprimentos[i] ?? 0} ${volta}`}
              strokeDashoffset={-(inicios[i] ?? 0)}
              style={{ stroke: `var(--cf-color-${kebab(s.color)})` }}
            >
              {s.label && <title>{s.label}</title>}
            </circle>
        ))}
      </svg>
      {label !== undefined && <div {...getStyles("label")}>{label}</div>}
    </div>
  );
}
