import { useComponentProps } from "@countify-oficial/provider";
import type { Spacing } from "@countify-oficial/tokens";
import type { ReactNode } from "react";
import { Badge } from "../Badge/Badge";
import { Group } from "../Group/Group";

export interface OverflowListProps<T> {
  items: T[];
  /** Desenha um item. */
  renderItem: (item: T, index: number) => ReactNode;
  /** Quantos aparecem; o resto vira o "+N". */
  maxVisible: number;
  /** Desenha o resumo do que ficou de fora. Padrão: Badge "+N". */
  renderOverflow?: ((hidden: T[]) => ReactNode) | undefined;
  /** Espaço entre os itens. Padrão: xs (4). */
  gap?: Spacing | undefined;
}

/** Mostra os primeiros itens numa linha e resume o resto ("+3"). */
export function OverflowList<T>(props: OverflowListProps<T>) {
  const { items, renderItem, maxVisible, renderOverflow, gap = "xs" } = useComponentProps("OverflowList", {}, props);
  const visiveis = items.slice(0, Math.max(0, maxVisible));
  const escondidos = items.slice(visiveis.length);
  return (
    <Group gap={gap} wrap={false}>
      {visiveis.map((item, i) => renderItem(item, i))}
      {escondidos.length > 0 && (renderOverflow ? renderOverflow(escondidos) : <Badge>{`+${escondidos.length}`}</Badge>)}
    </Group>
  );
}
