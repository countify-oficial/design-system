/** Os itens de um mesmo dia, com o nome do dia. */
export interface DayGroup<T> {
  /** O dia, como "2026-11-18" (hora local). */
  key: string;
  /** "hoje", "ontem" ou a data por extenso ("12 de novembro"; com o ano se não for o deste ano). */
  label: string;
  items: T[];
}

export interface GroupByDayOptions {
  /** Idioma da data por extenso. Padrão: pt-BR. */
  locale?: string | undefined;
  /** Nome do grupo de hoje (o texto do provider). Padrão: "hoje". */
  today?: string | undefined;
  /** Nome do grupo de ontem. Padrão: "ontem". */
  yesterday?: string | undefined;
  /** O agora (para teste). Padrão: new Date(). */
  now?: Date | undefined;
}

const chaveDoDia = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Junta os itens por dia do calendário local, na ordem em que chegam (a lista dos Avisos: Hoje, Ontem, 12 de novembro). */
export function groupByDay<T>(
  items: readonly T[],
  dateOf: (item: T) => Date,
  { locale = "pt-BR", today = "hoje", yesterday = "ontem", now = new Date() }: GroupByDayOptions = {},
): DayGroup<T>[] {
  const ontem = new Date(now);
  ontem.setDate(now.getDate() - 1);
  const nomes: Record<string, string> = { [chaveDoDia(now)]: today, [chaveDoDia(ontem)]: yesterday };
  const grupos = new Map<string, DayGroup<T>>();
  for (const item of items) {
    const d = dateOf(item);
    const key = chaveDoDia(d);
    let grupo = grupos.get(key);
    if (!grupo) {
      const ano = d.getFullYear() === now.getFullYear() ? {} : { year: "numeric" as const };
      const label = nomes[key] ?? d.toLocaleDateString(locale, { day: "numeric", month: "long", ...ano });
      grupos.set(key, (grupo = { key, label, items: [] }));
    }
    grupo.items.push(item);
  }
  return [...grupos.values()];
}
