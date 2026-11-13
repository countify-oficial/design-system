export interface FormatNumberOptions {
  /** Idioma e região (BCP 47). Padrão: pt-BR. */
  locale?: string | undefined;
  /** Casas decimais no máximo. */
  decimalScale?: number | undefined;
  /** Mostra sempre as casas de decimalScale (21,40). */
  fixedDecimalScale?: boolean | undefined;
  /** Opções do Intl.NumberFormat (style: "currency", currency: "BRL", signDisplay: "exceptZero"…). */
  format?: Intl.NumberFormatOptions | undefined;
}

/** Número no formato do idioma: 1284.5 → "1.284,5" em pt-BR. */
export function formatNumber(value: number, { locale = "pt-BR", decimalScale, fixedDecimalScale, format }: FormatNumberOptions = {}): string {
  return new Intl.NumberFormat(locale, {
    ...(decimalScale === undefined ? {} : { maximumFractionDigits: decimalScale }),
    ...(fixedDecimalScale && decimalScale !== undefined ? { minimumFractionDigits: decimalScale } : {}),
    ...format,
  }).format(value);
}

/** Corta o texto em pedaços, marcando os que batem com algum termo (sem diferenciar maiúsculas). */
export function highlighter(text: string, termos: string | string[]): { chunk: string; highlighted: boolean }[] {
  const lista = (Array.isArray(termos) ? termos : [termos]).map((t) => t.trim()).filter(Boolean);
  if (lista.length === 0) return [{ chunk: text, highlighted: false }];
  const escapar = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(${lista.map(escapar).join("|")})`, "gi");
  return text.split(re).filter(Boolean).map((chunk) => ({ chunk, highlighted: lista.some((t) => t.toLowerCase() === chunk.toLowerCase()) }));
}
