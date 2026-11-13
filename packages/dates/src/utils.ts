// Contas de datas (sem biblioteca): o dia é sempre a data local, sem hora.

export type DateValue = Date | null;
export type DatesRange = [DateValue, DateValue];

export const dayKey = (d: Date): number => d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
export const sameDay = (a: DateValue | undefined, b: DateValue | undefined): boolean => !!a && !!b && dayKey(a) === dayKey(b);
export const startOfDay = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const startOfMonth = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), 1);
export const addDays = (d: Date, n: number): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const addMonths = (d: Date, n: number): Date => {
  const alvo = new Date(d.getFullYear(), d.getMonth() + n, 1);
  // 31/01 + 1 mês = 28 ou 29/02, não 03/03
  const ultimo = new Date(alvo.getFullYear(), alvo.getMonth() + 1, 0).getDate();
  return new Date(alvo.getFullYear(), alvo.getMonth(), Math.min(d.getDate(), ultimo));
};

/** As semanas do mês, de domingo a sábado; null fora do mês. */
export function monthGrid(ano: number, mes: number, primeiroDia = 0): (Date | null)[][] {
  const inicio = (new Date(ano, mes, 1).getDay() - primeiroDia + 7) % 7;
  const dias = new Date(ano, mes + 1, 0).getDate();
  const celulas: (Date | null)[] = [...Array<null>(inicio).fill(null), ...Array.from({ length: dias }, (_, i) => new Date(ano, mes, i + 1))];
  while (celulas.length % 7) celulas.push(null);
  return Array.from({ length: celulas.length / 7 }, (_, s) => celulas.slice(s * 7, s * 7 + 7));
}

/** Fora do intervalo permitido. */
export const outOfBounds = (d: Date, min?: Date | null, max?: Date | null): boolean => (!!min && dayKey(d) < dayKey(min)) || (!!max && dayKey(d) > dayKey(max));

/** O papel do dia num período: start, end, single (um dia só), in (no meio) ou nenhum. */
export function rangeRole(d: Date, [inicio, fim]: DatesRange): "start" | "end" | "single" | "in" | null {
  if (!inicio) return null;
  const k = dayKey(d);
  const a = dayKey(inicio);
  const b = fim ? dayKey(fim) : a;
  if (k === a && k === b) return "single";
  if (k === a) return "start";
  if (k === b) return "end";
  return k > a && k < b ? "in" : null;
}

/** O próximo período ao tocar um dia: o 1º toque começa, o 2º fecha (antes do início, recomeça). */
export function nextRange([inicio, fim]: DatesRange, d: Date): DatesRange {
  if (!inicio || fim || dayKey(d) < dayKey(inicio)) return [d, null];
  return [inicio, d];
}

const capital = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

/** "Novembro de 2026". */
export const monthLabel = (d: Date, locale = "pt-BR"): string => capital(new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(d));

/** "sexta-feira, 13 de novembro de 2026" (o nome do dia para o leitor de tela). */
export const dayLabel = (d: Date, locale = "pt-BR"): string => new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(d);

/** As iniciais e os nomes dos dias da semana, a partir de primeiroDia (0 = domingo). */
export function weekdays(locale = "pt-BR", primeiroDia = 0): { short: string; long: string }[] {
  const base = new Date(2026, 10, 1); // um domingo
  return Array.from({ length: 7 }, (_, i) => {
    const d = addDays(base, (i + primeiroDia) % 7);
    return {
      short: new Intl.DateTimeFormat(locale, { weekday: "narrow" }).format(d).toUpperCase(),
      long: new Intl.DateTimeFormat(locale, { weekday: "long" }).format(d),
    };
  });
}

/** "13/11/2026". */
export const formatDate = (d: Date, locale = "pt-BR"): string => new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit", year: "numeric" }).format(d);

/** "13/11/2026" (ou "13/11/26") vira a data; inválida vira null. */
export function parseDate(texto: string): Date | null {
  const m = /^\s*(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})\s*$/.exec(texto);
  if (!m) return null;
  const [dia, mes, anoTxt] = [Number(m[1]), Number(m[2]), m[3] ?? ""];
  const ano = anoTxt.length === 2 ? 2000 + Number(anoTxt) : Number(anoTxt);
  const d = new Date(ano, mes - 1, dia);
  return d.getFullYear() === ano && d.getMonth() === mes - 1 && d.getDate() === dia ? d : null;
}

/** "08:05" (24 h). */
export const formatTime = (h: number, m: number): string => `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

/** "8:05", "08:05" ou "0805" viram { h, m }; inválido vira null. */
export function parseTime(texto: string): { h: number; m: number } | null {
  const m = /^\s*(\d{1,2}):?(\d{2})\s*$/.exec(texto);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  return h < 24 && min < 60 ? { h, m: min } : null;
}

/** "22/10 a 31/10/2026" (mesmo ano) ou "28/12/2025 a 03/01/2026"; só o início: "22/10/2026". */
export function formatRange([inicio, fim]: DatesRange, locale = "pt-BR"): string {
  if (!inicio) return "";
  if (!fim || sameDay(inicio, fim)) return formatDate(inicio, locale);
  const curto = new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit" });
  return inicio.getFullYear() === fim.getFullYear() ? `${curto.format(inicio)} a ${formatDate(fim, locale)}` : `${formatDate(inicio, locale)} a ${formatDate(fim, locale)}`;
}

/** Dois períodos iguais (dia a dia). */
export const sameRange = (a: DatesRange, b: DatesRange): boolean => sameDay(a[0], b[0]) && (sameDay(a[1], b[1]) || (!a[1] && !b[1]));
