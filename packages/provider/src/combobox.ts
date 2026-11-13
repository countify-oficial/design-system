
export interface ComboboxItem {
  value: string;
  label: string;
  disabled?: boolean | undefined;
}

export interface ComboboxGroup {
  group: string;
  items: (string | ComboboxItem)[];
}

/** Opções: textos, { value, label, disabled } ou grupos { group, items }. */
export type ComboboxData = (string | ComboboxItem | ComboboxGroup)[];

export interface ComboboxParsed {
  group: string | null;
  items: ComboboxItem[];
}

const item = (d: string | ComboboxItem): ComboboxItem => (typeof d === "string" ? { value: d, label: d } : d);

/** Põe as opções num formato só: grupos (o primeiro, sem nome, junta as soltas). */
export function parseComboboxData(data: ComboboxData): ComboboxParsed[] {
  const soltas: ComboboxItem[] = [];
  const grupos: ComboboxParsed[] = [];
  for (const d of data) {
    if (typeof d === "object" && "group" in d) grupos.push({ group: d.group, items: d.items.map(item) });
    else soltas.push(item(d));
  }
  return soltas.length > 0 ? [{ group: null, items: soltas }, ...grupos] : grupos;
}

/** Sem acento e em minúsculas: "São Paulo" e "sao paulo" batem. */
export const normalizeSearch = (t: string): string => t.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();

/** Filtra pelo texto do rótulo (sem diferenciar acento e maiúsculas). */
export function filterCombobox(grupos: ComboboxParsed[], busca: string, limite = Infinity): ComboboxParsed[] {
  const termo = normalizeSearch(busca);
  let resto = limite;
  return grupos
    .map((g) => {
      const itens = (termo ? g.items.filter((i) => normalizeSearch(i.label).includes(termo)) : g.items).slice(0, Math.max(0, resto));
      resto -= itens.length;
      return { group: g.group, items: itens };
    })
    .filter((g) => g.items.length > 0);
}

export const allItems = (grupos: ComboboxParsed[]): ComboboxItem[] => grupos.flatMap((g) => g.items);
