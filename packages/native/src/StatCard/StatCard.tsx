import { hasContent, useComponentProps, useCountifyTheme, useMessages } from "@countify-oficial/provider";
import { fontSize, headings, lineHeightPx, nativeFontFamily, space } from "@countify-oficial/tokens";
import type { ElementType, ReactNode } from "react";
import { Text as RNText, View, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import { Card } from "../Card/Card";
import { HelpTip } from "../HelpTip/HelpTip";
import type { PolymorphicProps } from "../polymorphic";
import { useThemeStyle } from "../styles";
import { StatDiff, type StatDiffProps } from "./StatDiff";

export interface StatCardOwnProps extends StatDiffProps {
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
  /** Estilo do cartão. */
  style?: StyleProp<ViewStyle>;
}

export type StatCardProps<C extends ElementType = typeof View> = PolymorphicProps<C, StatCardOwnProps>;

/** Texto solto vira Text com o estilo; o resto (um NumberFormatter, um RollingNumber) vai como veio. */
const comoTexto = (no: ReactNode, estilo: StyleProp<TextStyle>) => (typeof no === "string" || typeof no === "number" ? <RNText style={estilo}>{no}</RNText> : no);

/**
 * Cartão de indicador (mockup M-Hoje e W-Hoje): rótulo com o "?" opcional, o número com prefixo e unidade, a linha de
 * apoio e a variação com seta. `component={Pressable}` deixa o cartão inteiro tocável.
 */
export function StatCard<C extends ElementType = typeof View>(props: StatCardProps<C>) {
  const {
    component, label, value, prefix, unit, description, help, helpLabel, chart, diff, diffLabel, diffFormat, invertDiff, style, ...rest
  } = useComponentProps("StatCard", {}, props);
  const { colors: c } = useCountifyTheme();
  const tema = useThemeStyle("StatCard");
  const messages = useMessages();
  const nomeDaAjuda = helpLabel ?? (typeof label === "string" ? `${messages.help}: ${label}` : messages.help);
  const apoio = { color: c.text2, fontSize: fontSize.sm, lineHeight: lineHeightPx(fontSize.sm), fontFamily: nativeFontFamily[400] };
  const afixo = { color: c.text2, fontSize: fontSize.md, lineHeight: lineHeightPx(fontSize.md), fontFamily: nativeFontFamily[400] };
  const n = headings.number;
  return (
    <Card component={component as ElementType} gap={1} {...rest} style={[tema, style]}>
      {/* aprovado em 18/11/2026: o mockup pede 22 de altura mínima na linha do rótulo; 24 é a altura dela com o "?" */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: space[1], minHeight: space[6] }}>
        {comoTexto(label, [apoio, { flexShrink: 1 }])}
        {hasContent(help) && <HelpTip label={nomeDaAjuda}>{help}</HelpTip>}
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "baseline", gap: space[1] }}>
        {hasContent(prefix) && comoTexto(prefix, afixo)}
        {comoTexto(value, {
          color: c.text, fontSize: n.fontSize, lineHeight: lineHeightPx(n.fontSize, n.lineHeight), fontFamily: nativeFontFamily[n.fontWeight], fontVariant: ["tabular-nums"],
        })}
        {hasContent(unit) && comoTexto(unit, afixo)}
      </View>
      {hasContent(description) && comoTexto(description, [apoio, { fontVariant: ["tabular-nums"] }])}
      <StatDiff diff={diff} diffLabel={diffLabel} diffFormat={diffFormat} invertDiff={invertDiff} />
      {hasContent(chart) && chart}
    </Card>
  );
}
