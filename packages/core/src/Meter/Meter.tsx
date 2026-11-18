import { formatNumber, hasContent, useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import type { Tone } from "@countify-oficial/tokens";
import { useId, type ComponentPropsWithRef, type ReactNode } from "react";
import { Progress } from "../Progress/Progress";
import { StatDiff, type StatDiffProps } from "../StatCard/StatDiff";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./Meter.module.css";

export interface MeterProps
  extends StatDiffProps,
    StylesApiProps<"root" | "header" | "label" | "figure" | "value" | "diff" | "bar" | "legend" | "start" | "end" | "footer">,
    Omit<ComponentPropsWithRef<"div">, "className" | "style" | "children" | "color"> {
  /** O valor medido, na mesma unidade de min e max (71400 de 180000, 25 de 180). */
  value: number;
  /** O começo da escala. Padrão: 0. */
  min?: number | undefined;
  /** O fim da escala (a meta, o total). Padrão: 100. */
  max?: number | undefined;
  /** O nome do medidor, à esquerda do valor ("Faturamento"). Também é o nome da barra para o leitor de tela. */
  label?: ReactNode;
  /** O valor em destaque. Padrão: a porcentagem da escala com uma casa ("39,7%"); `null` esconde. */
  valueLabel?: ReactNode;
  /** O que o leitor de tela diz do valor (aria-valuetext). Padrão: a porcentagem ("39,7%"). */
  valueText?: string | undefined;
  /** O esperado até agora, na unidade de value: um traço sobre a barra. */
  marker?: number | undefined;
  /** Tom da parte cheia. Padrão: accent. */
  color?: Tone | undefined;
  /** md: o bloco da meta (barra de 8, número de 28). lg: a barra de conversão (barra de 16, número maior). Padrão: md. */
  size?: "md" | "lg" | undefined;
  /** Embaixo da barra, à esquerda ("R$ 71.400 de R$ 180.000"). */
  startLabel?: ReactNode;
  /** Embaixo da barra, à direita, em texto 2 ("dia 11 de 30"). */
  endLabel?: ReactNode;
  /** A linha de baixo, em 13 texto 2 ("1.428 peças vendidas no mês"). */
  footer?: ReactNode;
}

/** A porcentagem de value entre min e max, presa entre 0 e 100. */
const porcento = (n: number, min: number, max: number) => (max > min ? Math.min(100, Math.max(0, ((n - min) / (max - min)) * 100)) : 0);

/**
 * Medidor de meta (mockup W-Hoje, "Meta de novembro"; W-Indicadores, "Conversão"): rótulo e valor em destaque, a barra
 * (`role="meter"`) com o traço do esperado, a legenda dos dois lados e a linha de baixo. Vai dentro de um Card.
 */
export function Meter(props: MeterProps) {
  const { locale } = useCountifyTheme();
  const {
    value, min = 0, max = 100, label, valueLabel, valueText, marker, color = "accent", size = "md", startLabel, endLabel, footer,
    diff, diffLabel, diffFormat, invertDiff, "aria-label": ariaLabel, className, style, classNames, styles, ...rest
  } = useComponentProps("Meter", {}, props);
  const getStyles = useStyles("Meter", classes, { className, style, classNames, styles });
  const id = useId();
  const p = porcento(value, min, max);
  const texto = `${formatNumber(p, { locale, decimalScale: 1 })}%`;
  const destaque = valueLabel === undefined ? texto : valueLabel;
  const comRotulo = hasContent(label);
  return (
    <div data-size={size} {...rest} {...getStyles("root")}>
      {(comRotulo || hasContent(destaque) || diff !== undefined) && (
        <div {...getStyles("header")}>
          {comRotulo && <span id={id} {...getStyles("label")}>{label}</span>}
          <span {...getStyles("figure")}>
            {hasContent(destaque) && <span {...getStyles("value")}>{destaque}</span>}
            <StatDiff diff={diff} diffLabel={diffLabel} diffFormat={diffFormat} invertDiff={invertDiff} {...getStyles("diff")} />
          </span>
        </div>
      )}
      <Progress
        role="meter"
        value={p}
        marker={marker === undefined ? undefined : porcento(marker, min, max)}
        color={color}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={Math.min(max, Math.max(min, value))}
        aria-valuetext={valueText ?? texto}
        aria-labelledby={comRotulo && !ariaLabel ? id : undefined}
        aria-label={ariaLabel}
        {...getStyles("bar")}
      />
      {(hasContent(startLabel) || hasContent(endLabel) || hasContent(footer)) && (
        <div {...getStyles("legend")}>
          {(hasContent(startLabel) || hasContent(endLabel)) && (
            <div className={classes["legendRow"]}>
              <span {...getStyles("start")}>{startLabel}</span>
              {hasContent(endLabel) && <span {...getStyles("end")}>{endLabel}</span>}
            </div>
          )}
          {hasContent(footer) && <span {...getStyles("footer")}>{footer}</span>}
        </div>
      )}
    </div>
  );
}
