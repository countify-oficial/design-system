import { formatNumber, useComponentProps, useCountifyTheme, type FormatNumberOptions } from "@countify-oficial/provider";
import type { ComponentPropsWithRef, ReactNode } from "react";

export interface NumberFormatterProps extends FormatNumberOptions, Omit<ComponentPropsWithRef<"span">, "prefix"> {
  value: number | null | undefined;
  /** Antes do número ("R$ "). */
  prefix?: ReactNode;
  /** Depois do número (" %", " p.p."). */
  suffix?: ReactNode;
}

/** Número formatado no idioma do provider, com algarismos de mesma largura. Sem valor, não mostra nada. */
export function NumberFormatter(props: NumberFormatterProps) {
  const { locale: doProvider } = useCountifyTheme();
  const { value, prefix, suffix, locale = doProvider, decimalScale, fixedDecimalScale, format, style, ...rest } = useComponentProps("NumberFormatter", {}, props);
  if (value === null || value === undefined || Number.isNaN(value)) return null;
  return (
    <span {...rest} style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {prefix}
      {formatNumber(value, { locale, decimalScale, fixedDecimalScale, format })}
      {suffix}
    </span>
  );
}
