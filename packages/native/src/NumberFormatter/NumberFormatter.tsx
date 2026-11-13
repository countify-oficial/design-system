import { formatNumber, useComponentProps, useCountifyTheme, type FormatNumberOptions } from "@countify-oficial/provider";
import type { ReactNode } from "react";
import { Text, type TextProps } from "../Text/Text";

export type NumberFormatterProps = FormatNumberOptions &
  Omit<TextProps, "children"> & {
    value: number | null | undefined;
    /** Antes do número ("R$ "). */
    prefix?: ReactNode;
    /** Depois do número (" %"). */
    suffix?: ReactNode;
  };

/** Número formatado no idioma do provider, com algarismos de mesma largura (um Text). */
export function NumberFormatter(props: NumberFormatterProps) {
  const { locale: doProvider } = useCountifyTheme();
  const { value, prefix, suffix, locale = doProvider, decimalScale, fixedDecimalScale, format, style, ...rest } = useComponentProps("NumberFormatter", {}, props);
  if (value === null || value === undefined || Number.isNaN(value)) return null;
  return (
    <Text {...(rest)} style={[{ fontVariant: ["tabular-nums"] }, style]}>
      {prefix}
      {formatNumber(value, { locale, decimalScale, fixedDecimalScale, format })}
      {suffix}
    </Text>
  );
}
