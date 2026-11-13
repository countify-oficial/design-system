import { useControllableState } from "@countify-oficial/hooks";
import { findTreeNode, useComponentProps, type TreeNode } from "@countify-oficial/provider";
import { useState } from "react";
import { ChoiceField, type ChoiceFieldProps } from "../Combobox/ChoiceField";
import { Combobox } from "../Combobox/Combobox";
import { Tree } from "../Tree/Tree";

export interface TreeSelectProps extends ChoiceFieldProps {
  data: TreeNode[];
  /** Um valor (sem caixas) ou as folhas marcadas (multiple). */
  value?: string | string[] | null | undefined;
  defaultValue?: string | string[] | null | undefined;
  onChange?: ((value: string | string[] | null) => void) | undefined;
  multiple?: boolean | undefined;
  leavesOnly?: boolean | undefined;
  defaultExpanded?: string[] | undefined;
}

/** Escolhe numa árvore, numa folha que sobe. Com multiple, marca várias folhas (a folha fica aberta). */
export function TreeSelect(props: TreeSelectProps) {
  const { data, value, defaultValue, onChange, multiple, leavesOnly, defaultExpanded, label, ...campo } = useComponentProps("TreeSelect", {}, props);
  const [valor, setValor] = useControllableState<string | string[] | null>({ value, defaultValue: defaultValue ?? (multiple ? [] : null), onChange });
  const [aberto, setAberto] = useState(false);
  const lista = Array.isArray(valor) ? valor : valor === null ? [] : [valor];
  const texto = lista.map((v) => findTreeNode(data, v)?.label ?? v).join(", ");
  return (
    <Combobox opened={aberto} onOpenedChange={setAberto} title={label}>
      <ChoiceField {...campo} label={label} valor={texto || undefined} aberto={aberto} onPress={() => setAberto(true)} />
      <Combobox.Dropdown>
        <Tree
          data={data}
          defaultExpanded={defaultExpanded}
          leavesOnly={leavesOnly}
          {...(multiple
            ? { withCheckboxes: true, checked: lista, onCheckedChange: (v: string[]) => setValor(v) }
            : {
                selected: lista[0] ?? null,
                onSelect: (v: string) => {
                  setValor(v);
                  setAberto(false);
                },
              })}
        />
      </Combobox.Dropdown>
    </Combobox>
  );
}
