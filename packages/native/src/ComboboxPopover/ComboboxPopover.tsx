import { useControllableState } from "@countify-oficial/hooks";
import { allItems, filterCombobox, parseComboboxData, useComponentProps, useMessages, type ComboboxData, type ComboboxItem } from "@countify-oficial/provider";
import { useMemo, useState, type ReactElement, type ReactNode } from "react";
import type { GestureResponderEvent } from "react-native";
import { Combobox, ComboboxOptions } from "../Combobox/Combobox";
import { Icon } from "../Icon/Icon";
import { TextInput } from "../TextInput/TextInput";

export interface ComboboxPopoverProps {
  data: ComboboxData;
  value?: string | null | undefined;
  defaultValue?: string | null | undefined;
  onChange?: ((value: string | null, item: ComboboxItem | null) => void) | undefined;
  /** O que abre (um só filho com onPress, como o chip de filtro). */
  children: ReactElement<{ onPress?: ((e: GestureResponderEvent) => void) | undefined }>;
  /** Título da folha. */
  title?: ReactNode;
  searchPlaceholder?: string | undefined;
  nothingFoundMessage?: ReactNode;
}

/** Um botão (o "Chip de filtro" do mockup) que abre a folha com busca e opções. */
export function ComboboxPopover(props: ComboboxPopoverProps) {
  const messages = useMessages();
  const { data, value, defaultValue, onChange, children, title, searchPlaceholder = messages.search, nothingFoundMessage = messages.nothingFound } = useComponentProps("ComboboxPopover", {}, props);
  const grupos = useMemo(() => parseComboboxData(data), [data]);
  const itens = useMemo(() => allItems(grupos), [grupos]);
  const [valor, setValor] = useControllableState<string | null>({ value, defaultValue: defaultValue ?? null, onChange: (v) => onChange?.(v, itens.find((i) => i.value === v) ?? null) });
  const [aberto, setAberto] = useState(false);
  const [busca, setBusca] = useState("");
  return (
    <Combobox opened={aberto} onOpenedChange={setAberto} title={title} onOptionSubmit={(v) => { setValor(v); setAberto(false); setBusca(""); }}>
      <Combobox.Target>{children}</Combobox.Target>
      <Combobox.Dropdown>
        <TextInput accessibilityLabel={searchPlaceholder} placeholder={searchPlaceholder} leftSection={<Icon name="search" />} variant="outline" value={busca} onChangeText={setBusca} />
        <ComboboxOptions grupos={filterCombobox(grupos, busca)} escolhidos={valor === null ? [] : [valor]} vazio={nothingFoundMessage} />
      </Combobox.Dropdown>
    </Combobox>
  );
}
