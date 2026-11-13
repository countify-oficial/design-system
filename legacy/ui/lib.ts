// Regras que a web e o celular dividem: sem React, sem tela. Testadas em test.mjs.
import type { Option, Trend } from "./types.js";

// ---- "Selecionar todos" (toda lista de seleção múltipla tem um)
// itens bloqueados (disabled) não mudam: ficam como estão
type Item = { id: string; disabled?: boolean };
export function selectAllState(items: Item[], selected: string[]): "none" | "some" | "all" {
  const livres = items.filter((i) => !i.disabled);
  const n = livres.filter((i) => selected.includes(i.id)).length;
  return n === 0 ? "none" : n === livres.length ? "all" : "some";
}
export function toggleAll(items: Item[], selected: string[]): string[] {
  const livres = items.filter((i) => !i.disabled).map((i) => i.id);
  if (selectAllState(items, selected) === "all") return selected.filter((id) => !livres.includes(id));
  return [...selected, ...livres.filter((id) => !selected.includes(id))];
}
export function toggleId(selected: string[], id: string): string[] {
  return selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id];
}

// ---- calendário (datas locais; só o dia importa)
export const WEEKDAYS = [["D", "domingo"], ["S", "segunda"], ["T", "terça"], ["Q", "quarta"], ["Q", "quinta"], ["S", "sexta"], ["S", "sábado"]] as const;
export const dayKey = (d: Date) => d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
export const sameDay = (a?: Date | null, b?: Date | null) => !!a && !!b && dayKey(a) === dayKey(b);
export const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
export const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);

// semanas do mês, de domingo a sábado; null fora do mês
export function monthGrid(year: number, month: number): (Date | null)[][] {
  const primeiro = new Date(year, month, 1).getDay();
  const dias = new Date(year, month + 1, 0).getDate();
  const celulas: (Date | null)[] = [...Array(primeiro).fill(null), ...Array.from({ length: dias }, (_, i) => new Date(year, month, i + 1))];
  while (celulas.length % 7) celulas.push(null);
  return Array.from({ length: celulas.length / 7 }, (_, s) => celulas.slice(s * 7, s * 7 + 7));
}

// papel do dia no período: início, fim, dentro, dia único
export type RangeRole = "start" | "end" | "in" | "single";
export function rangeRole(day: Date, start?: Date | null, end?: Date | null): RangeRole | null {
  if (!start) return null;
  const k = dayKey(day), a = dayKey(start), b = end ? dayKey(end) : a;
  if (a === b) return k === a ? "single" : null;
  return k === a ? "start" : k === b ? "end" : k > a && k < b ? "in" : null;
}

// toque no calendário: o primeiro marca o início, o segundo o fim; antes do início recomeça
export type Range = { start: Date; end: Date | null };
export function nextRange({ start, end }: { start?: Date | null; end?: Date | null } = {}, day: Date): Range {
  if (!start || end || dayKey(day) < dayKey(start)) return { start: day, end: null };
  return { start, end: day };
}

const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export const monthLabel = (d: Date) => capital(new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(d));
export const dayLabel = (d: Date) => new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric" }).format(d);

// ---- campos
// hora digitada vira HH:MM, da esquerda para a direita: apagar não embaralha ("08:3" fica "08:3").
// Primeiro dígito acima de 2 só pode ser hora de um dígito: "8" vira "08".
export function formatTime(text: string): string {
  let d = String(text).replace(/\D/g, "");
  if (d[0] > "2") d = "0" + d;
  d = d.slice(0, 4);
  return d.length <= 2 ? d : d.slice(0, 2) + ":" + d.slice(2);
}

// texto do Select fechado: o rótulo; em seleção múltipla "Todos", até dois nomes ou "3 selecionados"
export function selectSummary(options: Option[], value?: string | string[], multiple?: boolean): string {
  if (!multiple) return options.find((o) => o.value === value)?.label ?? "";
  const vs = value || [], livres = options.filter((o) => !o.disabled);
  if (vs.length && livres.every((o) => vs.includes(o.value))) return "Todos";
  const nomes = options.filter((o) => vs.includes(o.value)).map((o) => o.label);
  return nomes.length <= 2 ? nomes.join(", ") : `${nomes.length} selecionados`;
}

// ---- números
export const clamp01 = (v: unknown) => Math.max(0, Math.min(1, Number(v) || 0));
// "1–50 de 312"
export function pageLabel(page: number, pageSize: number, total: number): string {
  if (!total) return "0 de 0";
  const de = (page - 1) * pageSize + 1;
  return `${de}–${Math.min(page * pageSize, total)} de ${total}`;
}
export const TREND: Record<Trend, [string, string]> = { up: ["▲", "alta de"], down: ["▼", "queda de"], flat: ["", ""] };

// mistura duas cores #RRGGBB (t = 0 dá a, t = 1 dá b): mapa de calor no celular
export function mix(a: string, b: string, t: number): string {
  const p = (h: string, i: number) => parseInt(h.slice(1 + i * 2, 3 + i * 2), 16);
  return "#" + [0, 1, 2].map((i) => Math.round(p(a, i) + (p(b, i) - p(a, i)) * t).toString(16).padStart(2, "0")).join("").toUpperCase();
}

// ---- contraste (WCAG): usado no teste dos tokens
export function contrast(a: string, b: string): number {
  const lum = (h: string) => {
    const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}
