import { hasContent, useComponentProps, useMessages } from "@countify-oficial/provider";
import type { ElementType, ReactNode } from "react";
import { Card } from "../Card/Card";
import { HelpTip } from "../HelpTip/HelpTip";
import type { PolymorphicProps } from "../polymorphic";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./StatCard.module.css";
import { StatDiff, type StatDiffProps } from "./StatDiff";

export interface StatCardOwnProps
  extends StatDiffProps, StylesApiProps<"root" | "header" | "label" | "figure" | "value" | "affix" | "description" | "diff" | "chart"> {
  /** O nome do indicador, em cima ("Entradas", "Faturamento"). */
  label: ReactNode;
  /** O número, em 28 com algarismos de mesma largura: texto ou um NumberFormatter / RollingNumber. */
  value: ReactNode;
  /** Antes do número, menor e em texto 2 ("R$"). */
  prefix?: ReactNode;
  /** Depois do número, menor e em texto 2 ("pessoas", "%", "tickets"). */
  unit?: ReactNode;
  /** A linha de apoio, embaixo do número ("79 peças"). */
  description?: ReactNode;
  /** A explicação que o "?" ao lado do rótulo mostra. Sem ela, não há "?". */
  help?: ReactNode;
  /** Nome do "?" para o leitor de tela. Padrão: "Ajuda" do provider e o rótulo, quando o rótulo é texto. */
  helpLabel?: string | undefined;
  /** Um gráfico pequeno no pé do cartão (o Sparkline do @countify-oficial/charts, por exemplo). */
  chart?: ReactNode;
}

export type StatCardProps<C extends ElementType = "div"> = PolymorphicProps<C, StatCardOwnProps>;

/**
 * Cartão de indicador (mockup W-Hoje e W-Indicadores): rótulo com o "?" opcional, o número com prefixo e unidade, a
 * linha de apoio e a variação com seta. `component="a"` deixa o cartão inteiro clicável.
 */
export function StatCard<C extends ElementType = "div">(props: StatCardProps<C>) {
  const {
    component, label, value, prefix, unit, description, help, helpLabel, chart, diff, diffLabel, diffFormat, invertDiff,
    className, style, classNames, styles, ...rest
  } = useComponentProps("StatCard", {}, props);
  const getStyles = useStyles("StatCard", classes, { className, style, classNames, styles });
  const messages = useMessages();
  const nomeDaAjuda = helpLabel ?? (typeof label === "string" ? `${messages.help}: ${label}` : messages.help);
  return (
    <Card component={component as ElementType} gap={1} {...rest} {...getStyles("root")}>
      <div {...getStyles("header")}>
        <span {...getStyles("label")}>{label}</span>
        {hasContent(help) && <HelpTip label={nomeDaAjuda}>{help}</HelpTip>}
      </div>
      <span {...getStyles("figure")}>
        {hasContent(prefix) && <span {...getStyles("affix")}>{prefix}</span>}
        <span {...getStyles("value")}>{value}</span>
        {hasContent(unit) && <span {...getStyles("affix")}>{unit}</span>}
      </span>
      {hasContent(description) && <span {...getStyles("description")}>{description}</span>}
      <StatDiff diff={diff} diffLabel={diffLabel} diffFormat={diffFormat} invertDiff={invertDiff} {...getStyles("diff")} />
      {hasContent(chart) && <div {...getStyles("chart")}>{chart}</div>}
    </Card>
  );
}
