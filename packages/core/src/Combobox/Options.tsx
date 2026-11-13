import type { ReactNode } from "react";
import { Combobox } from "./Combobox";
import type { ComboboxParsed } from "./data";

/** Desenha os grupos e as opções; nenhuma → a mensagem de vazio. */
export function ComboboxOptions({ grupos, escolhidos, vazio, withCheckIcon = true }: { grupos: ComboboxParsed[]; escolhidos: string[]; vazio?: ReactNode; withCheckIcon?: boolean | undefined }) {
  if (grupos.length === 0) return vazio === undefined || vazio === null ? null : <Combobox.Empty>{vazio}</Combobox.Empty>;
  return grupos.map((g) => {
    const opcoes = g.items.map((i) => (
      <Combobox.Option key={i.value} value={i.value} selected={escolhidos.includes(i.value)} disabled={i.disabled} withCheckIcon={withCheckIcon}>{i.label}</Combobox.Option>
    ));
    return g.group === null ? opcoes : <Combobox.Group key={g.group} label={g.group}>{opcoes}</Combobox.Group>;
  });
}
