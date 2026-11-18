import { formatNumber, hasContent, useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { fontSize, headings, lineHeightPx, nativeFontFamily, space, type Tone } from "@countify-oficial/tokens";
import type { ReactNode } from "react";
import { Text as RNText, View, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import { Progress } from "../Progress/Progress";
import { StatDiff, type StatDiffProps } from "../StatCard/StatDiff";
import { useThemeStyle } from "../styles";

export interface MeterProps extends StatDiffProps {
  /** O valor medido, na mesma unidade de min e max (71400 de 180000, 25 de 180). */
  value: number;
  /** O começo da escala. Padrão: 0. */
  min?: number | undefined;
  /** O fim da escala (a meta, o total). Padrão: 100. */
  max?: number | undefined;
  /** O nome do medidor, à esquerda do valor ("Faturamento"). Quando é texto, também é o nome da barra para o leitor de tela. */
  label?: ReactNode;
  /** O valor em destaque. Padrão: a porcentagem da escala com uma casa ("39,7%"); `null` esconde. */
  valueLabel?: ReactNode;
  /** O que o leitor de tela diz do valor. Padrão: a porcentagem ("39,7%"). */
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
  /** Nome da barra para o leitor de tela, quando o label não é texto ou não existe. */
  accessibilityLabel?: string | undefined;
  /** Estilo do bloco. */
  style?: StyleProp<ViewStyle>;
  /** Identificador do bloco nos testes. */
  testID?: string | undefined;
}

const porcento = (n: number, min: number, max: number) => (max > min ? Math.min(100, Math.max(0, ((n - min) / (max - min)) * 100)) : 0);
const comoTexto = (no: ReactNode, estilo: StyleProp<TextStyle>) => (typeof no === "string" || typeof no === "number" ? <RNText style={estilo}>{no}</RNText> : no);

/**
 * Medidor de meta (mockup M-Hoje, "Meta de novembro"; W-Indicadores, "Conversão"): rótulo e valor em destaque, a barra
 * com o traço do esperado, a legenda dos dois lados e a linha de baixo. Vai dentro de um Card.
 */
export function Meter(props: MeterProps) {
  const {
    value, min = 0, max = 100, label, valueLabel, valueText, marker, color = "accent", size = "md", startLabel, endLabel, footer,
    diff, diffLabel, diffFormat, invertDiff, accessibilityLabel, style, testID,
  } = useComponentProps("Meter", {}, props);
  const { colors: c, locale } = useCountifyTheme();
  const tema = useThemeStyle("Meter");
  const lg = size === "lg";
  const p = porcento(value, min, max);
  const texto = `${formatNumber(p, { locale, decimalScale: 1 })}%`;
  const destaque = valueLabel === undefined ? texto : valueLabel;
  // a confirmar: o mockup pede o número do lg em 40; o maior título dos tokens é o tabTitle, de 32
  const h = lg ? headings.tabTitle : headings.number;
  const legenda = { fontSize: fontSize.sm, lineHeight: lineHeightPx(fontSize.sm), fontFamily: nativeFontFamily[400], fontVariant: ["tabular-nums"] } as const;
  return (
    <View testID={testID} style={[{ gap: lg ? space[4] : space[3] }, tema, style]}>
      {(hasContent(label) || hasContent(destaque) || diff !== undefined) && (
        <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: space[3] }}>
          {hasContent(label) && comoTexto(label, { color: c.text, fontSize: fontSize.md, lineHeight: lineHeightPx(fontSize.md), fontFamily: nativeFontFamily[500], flexShrink: 1 })}
          <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "baseline", gap: space[2] }}>
            {hasContent(destaque) &&
              comoTexto(destaque, { color: c.text, fontSize: h.fontSize, lineHeight: lineHeightPx(h.fontSize, h.lineHeight), fontFamily: nativeFontFamily[h.fontWeight], fontVariant: ["tabular-nums"] })}
            <StatDiff diff={diff} diffLabel={diffLabel} diffFormat={diffFormat} invertDiff={invertDiff} size={lg ? fontSize.md : fontSize.sm} />
          </View>
        </View>
      )}
      <Progress
        value={p}
        marker={marker === undefined ? undefined : porcento(marker, min, max)}
        color={color}
        accessibilityLabel={accessibilityLabel ?? (typeof label === "string" ? label : undefined)}
        accessibilityValue={{ min, max, now: Math.min(max, Math.max(min, value)), text: valueText ?? texto }}
        style={lg ? { height: space[4], borderRadius: space[2], backgroundColor: c.divider } : undefined}
      />
      {(hasContent(startLabel) || hasContent(endLabel) || hasContent(footer)) && (
        <View>
          {(hasContent(startLabel) || hasContent(endLabel)) && (
            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: space[3] }}>
              {comoTexto(startLabel ?? "", [legenda, { color: c.text, flexShrink: 1 }])}
              {hasContent(endLabel) && comoTexto(endLabel, [legenda, { color: c.text2, textAlign: "right" }])}
            </View>
          )}
          {hasContent(footer) && comoTexto(footer, { color: c.text2, fontSize: fontSize.xs, lineHeight: lineHeightPx(fontSize.xs), fontFamily: nativeFontFamily[400] })}
        </View>
      )}
    </View>
  );
}
