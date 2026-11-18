import { formatNumber, hasContent, useCountifyTheme, useMessages } from "@countify-oficial/provider";
import { fontSize, lineHeightPx, nativeFontFamily } from "@countify-oficial/tokens";
import type { ReactNode } from "react";
import { Text as RNText } from "react-native";

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

/** A variação com seta, cor e o sentido lido pelo leitor de tela ("alta de 12% vs. qua."). Parte do StatCard e do Meter. */
export function StatDiff({ diff, diffLabel, diffFormat, invertDiff, size = fontSize.sm }: StatDiffProps & { size?: number }) {
  const { colors: c, locale } = useCountifyTheme();
  const messages = useMessages();
  if (diff === undefined || Number.isNaN(diff)) return null;
  const texto = diffFormat ? diffFormat(Math.abs(diff)) : `${formatNumber(Math.abs(diff), { locale })}%`;
  const sentido = diff > 0 ? "up" : diff < 0 ? "down" : "flat";
  const bom = invertDiff ? diff < 0 : diff > 0;
  const lido = sentido === "up" ? messages.increase(texto) : sentido === "down" ? messages.decrease(texto) : messages.noChange;
  const comparacao = typeof diffLabel === "string" || typeof diffLabel === "number" ? ` ${String(diffLabel)}` : "";
  return (
    <RNText
      accessibilityLabel={lido + comparacao}
      style={{
        color: sentido === "flat" ? c.text2 : bom ? c.up : c.down, fontSize: size, lineHeight: lineHeightPx(size),
        fontFamily: nativeFontFamily[500], fontVariant: ["tabular-nums"],
      }}
    >
      {sentido === "up" ? "▲ " : sentido === "down" ? "▼ " : ""}{texto}
      {hasContent(diffLabel) && <RNText style={{ color: c.text2, fontSize: fontSize.sm, fontFamily: nativeFontFamily[400] }}> {diffLabel}</RNText>}
    </RNText>
  );
}
