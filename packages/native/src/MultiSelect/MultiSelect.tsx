import { useControllableState } from "@countify-oficial/hooks";
import { allItems, filterCombobox, parseComboboxData, useComponentProps, useMessages, type ComboboxData } from "@countify-oficial/provider";
import { useMemo, useState, type ReactNode } from "react";
import { ChoiceField, type ChoiceFieldProps } from "../Combobox/ChoiceField";
import { Combobox, ComboboxOptions } from "../Combobox/Combobox";
import { Icon } from "../Icon/Icon";
import { Pill } from "../Pill/Pill";
import { TextInput } from "../TextInput/TextInput";

export interface MultiSelectProps extends ChoiceFieldProps {
  data: ComboboxData;
  value?: string[] | undefined;
  defaultValue?: string[] | undefined;
  onChange?: ((value: string[]) => void) | undefined;
  searchable?: boolean | undefined;
  maxValues?: number | undefined;
  hidePickedOptions?: boolean | undefined;
  nothingFoundMessage?: ReactNode;
}

/** Escolhe vários valores: as escolhas viram etiquetas no campo; a folha marca e desmarca sem fechar. */
export function MultiSelect(props: MultiSelectProps) {
  const messages = useMessages();
  const { data, value, defaultValue, onChange, searchable, maxValues, hidePickedOptions, nothingFoundMessage = messages.nothingFound, label, disabled, ...campo } = useComponentProps("MultiSelect", {}, props);
  const grupos = useMemo(() => parseComboboxData(data), [data]);
  const itens = useMemo(() => allItems(grupos), [grupos]);
  const [valores, setValores] = useControllableState<string[]>({ value, defaultValue: defaultValue ?? [], onChange });
  const [aberto, setAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const base = hidePickedOptions ? grupos.map((g) => ({ ...g, items: g.items.filter((i) => !valores.includes(i.value)) })) : grupos;
  return (
    <Combobox
      opened={aberto}
      onOpenedChange={setAberto}
      title={label}
      onOptionSubmit={(v) => {
        if (valores.includes(v)) setValores(valores.filter((x) => x !== v));
        else if (maxValues === undefined || valores.length < maxValues) setValores([...valores, v]);
      }}
    >
      <ChoiceField
        {...campo}
        label={label}
        disabled={disabled}
        aberto={aberto}
        onPress={() => setAberto(true)}
        valor={valores.length > 0 ? valores.map((v) => itens.find((i) => i.value === v)?.label ?? v).join(", ") : undefined}
        conteudo={valores.length > 0 ? valores.map((v) => <Pill key={v} withRemoveButton disabled={disabled} onRemove={() => setValores(valores.filter((x) => x !== v))}>{itens.find((i) => i.value === v)?.label ?? v}</Pill>) : undefined}
      />
      <Combobox.Dropdown>
        {searchable && <TextInput accessibilityLabel={messages.search} placeholder={messages.search} leftSection={<Icon name="search" />} variant="outline" value={busca} onChangeText={setBusca} />}
        <ComboboxOptions grupos={filterCombobox(base, searchable ? busca : "")} escolhidos={valores} vazio={nothingFoundMessage} />
      </Combobox.Dropdown>
    </Combobox>
  );
}
