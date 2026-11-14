import { useControllableState } from "@countify-oficial/hooks";
import { findTreeNode, useComponentProps, type TreeNode } from "@countify-oficial/provider";
import { useState, type ChangeEvent } from "react";
import { Icon } from "../Icon/Icon";
import { InputBase, type InputBaseOwnProps } from "../Input/Input";
import type { PolymorphicProps } from "../polymorphic";
import { Popover } from "../Popover/Popover";
import { Tree } from "../Tree/Tree";

export type TreeSelectProps = PolymorphicProps<
  "input",
  Omit<InputBaseOwnProps, "rightSection"> & {
    data: TreeNode[];
    /** Um valor (sem caixas) ou as folhas marcadas (multiple). */
    value?: string | string[] | null | undefined;
    defaultValue?: string | string[] | null | undefined;
    onChange?: ((value: string | string[] | null) => void) | undefined;
    /** Caixas de marcar; o valor vira a lista de folhas marcadas. */
    multiple?: boolean | undefined;
    /** Só folhas podem ser escolhidas (sem caixas). */
    leavesOnly?: boolean | undefined;
    defaultExpanded?: string[] | undefined;
  }
>;

/** Escolhe numa árvore (rede → cidade → loja), que abre embaixo do campo. Com multiple, marca várias folhas. */
export function TreeSelect(props: TreeSelectProps) {
  const { data, value, defaultValue, onChange, multiple, leavesOnly, defaultExpanded, disabled, ...rest } = useComponentProps("TreeSelect", {}, props);
  const [valor, setValor] = useControllableState<string | string[] | null>({ value, defaultValue: defaultValue ?? (multiple ? [] : null), onChange });
  const [aberto, setAberto] = useState(false);
  const lista = Array.isArray(valor) ? valor : valor === null ? [] : [valor];
  const texto = lista.map((v) => findTreeNode(data, v)?.label ?? v).join(", ");
  const nome = typeof rest.label === "string" ? rest.label : undefined;
  return (
    <Popover opened={aberto && !disabled} onChange={setAberto} position="bottom-start" width="target" trapFocus>
      <Popover.Target>
        <InputBase
          {...rest}
          component="input"
          // abre um seletor: o padrão "date picker combobox" do WAI-ARIA (textbox não aceita aria-expanded)
          role="combobox"
          readOnly
          disabled={disabled}
          value={texto}
          onChange={(_e: ChangeEvent<HTMLInputElement>) => undefined}
          rightSection={<Icon name="chevron-down" />}
          rightSectionPointerEvents="none"
        />
      </Popover.Target>
      <Popover.Dropdown aria-label={nome} style={{ padding: "var(--cf-space-1)" }}>
        <Tree
          data={data}
          defaultExpanded={defaultExpanded}
          aria-label={nome}
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
      </Popover.Dropdown>
    </Popover>
  );
}
