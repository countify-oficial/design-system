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

/** Os separadores de milhar e de decimal do idioma ("." e "," em pt-BR). */
export function numberSeparators(locale = "pt-BR"): { group: string; decimal: string } {
  const partes = new Intl.NumberFormat(locale).formatToParts(12345.6);
  return {
    group: partes.find((p) => p.type === "group")?.value ?? "",
    decimal: partes.find((p) => p.type === "decimal")?.value ?? ".",
  };
}

/** Lê um número escrito no idioma ("1.284,5" em pt-BR → 1284.5). Texto vazio ou inválido → undefined. */
export function parseNumber(texto: string, locale = "pt-BR"): number | undefined {
  const { group, decimal } = numberSeparators(locale);
  const limpo = texto.trim().split(group).join("").split(decimal).join(".").replace(/[^\d.-]/g, "");
  if (limpo === "" || limpo === "-" || limpo === ".") return undefined;
  const n = Number(limpo);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * Aplica uma máscara: 9 = algarismo, a = letra, * = qualquer um; o resto é fixo ("(99) 99999-9999").
 * Devolve o texto com a máscara e só os caracteres digitados (raw).
 */
export function applyMask(texto: string, mask: string): { masked: string; raw: string } {
  const aceita = (m: string, c: string) => (m === "9" ? /\d/.test(c) : m === "a" ? /\p{L}/u.test(c) : m === "*" ? /[\p{L}\d]/u.test(c) : false);
  const fixo = (m: string) => m !== "9" && m !== "a" && m !== "*";
  const entrada = Array.from(texto).filter((c) => /[\p{L}\d]/u.test(c));
  let masked = "";
  let raw = "";
  let i = 0;
  for (const m of mask) {
    if (i >= entrada.length) break;
    if (fixo(m)) {
      masked += m;
      continue;
    }
    // pula o que não cabe nesta posição (letra onde vai algarismo)
    while (i < entrada.length && !aceita(m, entrada[i] ?? "")) i++;
    const c = entrada[i];
    if (c === undefined) break;
    masked += c;
    raw += c;
    i++;
  }
  return { masked, raw };
}
