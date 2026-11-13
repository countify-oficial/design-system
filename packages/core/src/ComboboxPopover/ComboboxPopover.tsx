import { useControllableState } from "@countify-oficial/hooks";
import { useComponentProps, useMessages } from "@countify-oficial/provider";
import type { Placement } from "@floating-ui/react";
import { useMemo, useState, type ReactElement, type ReactNode, type Ref } from "react";
import { Combobox } from "../Combobox/Combobox";
import { allItems, filterCombobox, parseComboboxData, type ComboboxData, type ComboboxItem } from "../Combobox/data";
import { ComboboxOptions } from "../Combobox/Options";
import { Icon } from "../Icon/Icon";
import { Input } from "../Input/Input";
import { Popover } from "../Popover/Popover";

export interface ComboboxPopoverProps {
  data: ComboboxData;
  value?: string | null | undefined;
  defaultValue?: string | null | undefined;
  onChange?: ((value: string | null, item: ComboboxItem | null) => void) | undefined;
  /** O botão que abre (um só filho). */
  children: ReactElement<Record<string, unknown> & { ref?: Ref<unknown> }>;
  /** Texto do campo de busca. Padrão: "Buscar". */
  searchPlaceholder?: string | undefined;
  nothingFoundMessage?: ReactNode;
  /** Padrão: bottom-start. */
  position?: Placement | undefined;
  /** Largura. Padrão: 320. */
  width?: number | string | undefined;
}

/** Um botão (o "Chip de filtro", por exemplo) que abre busca e opções. Escolher fecha e devolve o foco ao botão. */
export function ComboboxPopover(props: ComboboxPopoverProps) {
  const messages = useMessages();
  const { data, value, defaultValue, onChange, children, searchPlaceholder = messages.search, nothingFoundMessage = messages.nothingFound, position = "bottom-start", width = 320 } =
    useComponentProps("ComboboxPopover", {}, props);
  const grupos = useMemo(() => parseComboboxData(data), [data]);
  const itens = useMemo(() => allItems(grupos), [grupos]);
  const [valor, setValor] = useControllableState<string | null>({ value, defaultValue: defaultValue ?? null, onChange: (v) => onChange?.(v, itens.find((i) => i.value === v) ?? null) });
  const [aberto, setAberto] = useState(false);
  const [busca, setBusca] = useState("");
  return (
    <Popover opened={aberto} onChange={(v) => { setAberto(v); if (!v) setBusca(""); }} position={position} width={width} trapFocus>
      <Popover.Target>{children}</Popover.Target>
      <Popover.Dropdown style={{ padding: "var(--cf-space-2)" }}>
        <Combobox
          inline
          onOptionSubmit={(v) => {
            setValor(v);
            setAberto(false);
            setBusca("");
          }}
        >
          <Combobox.Target>
            <Input aria-label={searchPlaceholder} placeholder={searchPlaceholder} leftSection={<Icon name="search" />} variant="outline" value={busca} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBusca(e.currentTarget.value)} />
          </Combobox.Target>
          <Combobox.Dropdown style={{ marginTop: "var(--cf-space-2)" }}>
            <ComboboxOptions grupos={filterCombobox(grupos, busca)} escolhidos={valor === null ? [] : [valor]} vazio={nothingFoundMessage} />
          </Combobox.Dropdown>
        </Combobox>
      </Popover.Dropdown>
    </Popover>
  );
}
