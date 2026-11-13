import { useControllableState } from "@countify-oficial/hooks";
import { useComponentProps, useMessages } from "@countify-oficial/provider";
import { useMemo, useState, type ComponentPropsWithRef, type KeyboardEvent, type ReactNode } from "react";
import { CloseButton } from "../CloseButton/CloseButton";
import { Combobox } from "../Combobox/Combobox";
import { allItems, filterCombobox, parseComboboxData, type ComboboxData } from "../Combobox/data";
import { ComboboxOptions } from "../Combobox/Options";
import { Icon } from "../Icon/Icon";
import { Pill } from "../Pill/Pill";
import { PillsInput, type PillsInputProps } from "../PillsInput/PillsInput";

export interface MultiSelectProps extends Omit<PillsInputProps, "onChange" | "defaultValue" | "rightSection" | "children"> {
  data: ComboboxData;
  value?: string[] | undefined;
  defaultValue?: string[] | undefined;
  onChange?: ((value: string[]) => void) | undefined;
  /** Deixa digitar para filtrar. Padrão: true. */
  searchable?: boolean | undefined;
  clearable?: boolean | undefined;
  /** No máximo quantos. */
  maxValues?: number | undefined;
  /** Tira da lista as já escolhidas. */
  hidePickedOptions?: boolean | undefined;
  nothingFoundMessage?: ReactNode;
  placeholder?: string | undefined;
  limit?: number | undefined;
  maxDropdownHeight?: number | string | undefined;
  /** Props do campo de texto. */
  inputProps?: ComponentPropsWithRef<"input"> | undefined;
}

/** Escolhe vários valores de uma lista; cada um vira uma etiqueta. Backspace no campo vazio tira a última. */
export function MultiSelect(props: MultiSelectProps) {
  const messages = useMessages();
  const {
    data, value, defaultValue, onChange, searchable = true, clearable, maxValues, hidePickedOptions, nothingFoundMessage = messages.nothingFound, placeholder, limit,
    maxDropdownHeight, inputProps, disabled, ...rest
  } = useComponentProps("MultiSelect", {}, props);
  const grupos = useMemo(() => parseComboboxData(data), [data]);
  const itens = useMemo(() => allItems(grupos), [grupos]);
  const [valores, setValores] = useControllableState<string[]>({ value, defaultValue: defaultValue ?? [], onChange });
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState(false);
  const escolher = (v: string) => {
    if (valores.includes(v)) setValores(valores.filter((x) => x !== v));
    else if (maxValues === undefined || valores.length < maxValues) setValores([...valores, v]);
    setBusca("");
  };
  const base = hidePickedOptions ? grupos.map((g) => ({ ...g, items: g.items.filter((i) => !valores.includes(i.value)) })) : grupos;
  const visiveis = filterCombobox(base, searchable ? busca : "", limit);
  return (
    <Combobox opened={aberto && !disabled} onOpenedChange={setAberto} maxDropdownHeight={maxDropdownHeight} disabled={disabled} onOptionSubmit={escolher}>
      <Combobox.Anchor>
        <PillsInput
          {...rest}
          disabled={disabled}
          onClick={() => setAberto(true)}
          rightSection={clearable && valores.length > 0 ? <CloseButton aria-label={messages.clear} color="text2" onClick={() => setValores([])} /> : <Icon name="chevron-down" />}
        >
          {valores.map((v) => (
            <Pill key={v} withRemoveButton disabled={disabled} onRemove={() => setValores(valores.filter((x) => x !== v))}>{itens.find((i) => i.value === v)?.label ?? v}</Pill>
          ))}
          <Combobox.Target>
            <PillsInput.Field
              {...inputProps}
              value={busca}
              readOnly={!searchable}
              placeholder={valores.length === 0 ? placeholder : undefined}
              onChange={(e) => {
                setBusca(e.currentTarget.value);
                setAberto(true);
              }}
              onFocus={() => setAberto(true)}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Backspace" && busca === "" && valores.length > 0) setValores(valores.slice(0, -1));
              }}
            />
          </Combobox.Target>
        </PillsInput>
      </Combobox.Anchor>
      <Combobox.Dropdown>
        <ComboboxOptions grupos={visiveis} escolhidos={valores} vazio={nothingFoundMessage} />
      </Combobox.Dropdown>
    </Combobox>
  );
}
