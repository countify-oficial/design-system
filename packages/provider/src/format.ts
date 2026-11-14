import type { ReactNode } from "react";

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

// Um Intl.NumberFormat por idioma e opções: criar um custa dezenas de µs (3000 células: 80 ms contra 1 ms reaproveitando).
// O mapa só cresce com as combinações de opções escritas no código, que são poucas.
const formatadores = new Map<string, Intl.NumberFormat>();
function formatador(locale: string, opcoes: Intl.NumberFormatOptions = {}): Intl.NumberFormat {
  const chave = `${locale}|${JSON.stringify(opcoes)}`;
  let f = formatadores.get(chave);
  if (!f) formatadores.set(chave, (f = new Intl.NumberFormat(locale, opcoes)));
  return f;
}

/** Número no formato do idioma: 1284.5 → "1.284,5" em pt-BR. */
export function formatNumber(value: number, { locale = "pt-BR", decimalScale, fixedDecimalScale, format }: FormatNumberOptions = {}): string {
  return formatador(locale, {
    ...(decimalScale === undefined ? {} : { maximumFractionDigits: decimalScale }),
    ...(fixedDecimalScale && decimalScale !== undefined ? { minimumFractionDigits: decimalScale } : {}),
    ...format,
  }).format(value);
}

/**
 * Prende o número entre min e max e o arredonda a decimalScale casas como o Intl arredonda ao mostrar (10,555 → 10,56):
 * o valor guardado é o que o campo mostra. A regra do NumberInput da web e do celular.
 */
export function limitNumber(n: number, { min, max, decimalScale }: { min?: number | undefined; max?: number | undefined; decimalScale?: number | undefined } = {}): number {
  const arredondado = decimalScale === undefined ? n : Number(formatNumber(n, { locale: "en-US", decimalScale, format: { useGrouping: false } }));
  return Math.min(max ?? Infinity, Math.max(min ?? -Infinity, arredondado));
}

/** Casas decimais de um número escrito (0.25 → 2): o passo do Slider arredonda nelas. */
export const decimalPlaces = (n: number): number => (String(n).split(".")[1] ?? "").length;

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
  const partes = formatador(locale).formatToParts(12345.6);
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

/** "(85) 99999-0000" para celular (11 algarismos com DDD) e "(85) 3333-0000" para fixo (10). */
export const phoneMask = (digitos: string): string => (digitos.replace(/\D/g, "").length > 10 ? "(99) 99999-9999" : "(99) 9999-99999");

/** "Ana Souza" → "AS"; um nome só → as duas primeiras letras. */
export function initials(name: string): string {
  const partes = name.trim().split(/\s+/).filter(Boolean);
  const [primeira = "", ultima] = [partes[0], partes.length > 1 ? partes.at(-1) : undefined];
  return (ultima ? (primeira[0] ?? "") + (ultima[0] ?? "") : primeira.slice(0, 2)).toUpperCase();
}

/** JSON que o JsonInput aceita: vazio também vale. */
export function isValidJson(texto: string): boolean {
  if (texto.trim() === "") return true;
  try {
    JSON.parse(texto);
    return true;
  } catch {
    return false;
  }
}

/** Rótulo, descrição ou erro com o que desenhar. true só marca (o erro sem mensagem deixa o campo vermelho), sem texto. */
export const hasContent = (v: ReactNode): boolean => v !== undefined && v !== null && v !== false && v !== true && v !== "";
