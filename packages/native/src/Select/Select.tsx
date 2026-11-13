import { useControllableState } from "@countify-oficial/hooks";
import { allItems, filterCombobox, parseComboboxData, useComponentProps, useMessages, type ComboboxData, type ComboboxItem } from "@countify-oficial/provider";
import { useMemo, useState, type ReactNode } from "react";
import { ChoiceField, type ChoiceFieldProps } from "../Combobox/ChoiceField";
import { Combobox, ComboboxOptions } from "../Combobox/Combobox";
import { Icon } from "../Icon/Icon";
import { TextInput } from "../TextInput/TextInput";

export interface SelectProps extends ChoiceFieldProps {
  data: ComboboxData;
  value?: string | null | undefined;
  defaultValue?: string | null | undefined;
  onChange?: ((value: string | null, item: ComboboxItem | null) => void) | undefined;
  /** Mostra uma busca no topo da folha. */
  searchable?: boolean | undefined;
  allowDeselect?: boolean | undefined;
  nothingFoundMessage?: ReactNode;
  limit?: number | undefined;
}

/** Escolhe um valor: o campo mostra a escolha e abre a folha com as opções (e a busca, com searchable). */
export function Select(props: SelectProps) {
  const messages = useMessages();
  const { data, value, defaultValue, onChange, searchable, allowDeselect = true, nothingFoundMessage = messages.nothingFound, limit, label, ...campo } = useComponentProps("Select", {}, props);
  const grupos = useMemo(() => parseComboboxData(data), [data]);
  const itens = useMemo(() => allItems(grupos), [grupos]);
  const [valor, setValor] = useControllableState<string | null>({ value, defaultValue: defaultValue ?? null, onChange: (v) => onChange?.(v, itens.find((i) => i.value === v) ?? null) });
  const [aberto, setAberto] = useState(false);
  const [busca, setBusca] = useState("");
  return (
    <Combobox
      opened={aberto}
      onOpenedChange={(v) => { setAberto(v); if (!v) setBusca(""); }}
      title={label}
      onOptionSubmit={(v) => {
        setValor(allowDeselect && v === valor ? null : v);
        setAberto(false);
        setBusca("");
      }}
    >
      <ChoiceField {...campo} label={label} valor={itens.find((i) => i.value === valor)?.label} aberto={aberto} onPress={() => setAberto(true)} />
      <Combobox.Dropdown>
        {searchable && <TextInput accessibilityLabel={messages.search} placeholder={messages.search} leftSection={<Icon name="search" />} variant="outline" value={busca} onChangeText={setBusca} />}
        <ComboboxOptions grupos={filterCombobox(grupos, searchable ? busca : "", limit)} escolhidos={valor === null ? [] : [valor]} vazio={nothingFoundMessage} />
      </Combobox.Dropdown>
    </Combobox>
  );
}
