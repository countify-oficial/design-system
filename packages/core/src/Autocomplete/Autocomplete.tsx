import { useControllableState } from "@countify-oficial/hooks";
import { filterCombobox, parseComboboxData, useComponentProps, type ComboboxData } from "@countify-oficial/provider";
import { useMemo, useState, type ChangeEvent, type FocusEvent } from "react";
import { Combobox } from "../Combobox/Combobox";
import { ComboboxOptions } from "../Combobox/Options";
import { InputBase, type InputBaseOwnProps } from "../Input/Input";
import type { PolymorphicProps } from "../polymorphic";

export type AutocompleteProps = PolymorphicProps<
  "input",
  InputBaseOwnProps & {
    /** Sugestões. */
    data: ComboboxData;
    value?: string | undefined;
    defaultValue?: string | undefined;
    onChange?: ((value: string) => void) | undefined;
    /** Chamado ao escolher uma sugestão. */
    onOptionSubmit?: ((value: string) => void) | undefined;
    limit?: number | undefined;
    maxDropdownHeight?: number | string | undefined;
  }
>;

/** Campo de texto livre com sugestões que aparecem ao digitar (o texto não precisa ser uma delas). */
export function Autocomplete(props: AutocompleteProps) {
  const { data, value, defaultValue, onChange, onOptionSubmit, limit, maxDropdownHeight, disabled, onFocus, ...rest } = useComponentProps("Autocomplete", {}, props);
  const grupos = useMemo(() => parseComboboxData(data), [data]);
  const [texto, setTexto] = useControllableState({ value, defaultValue: defaultValue ?? "", onChange });
  const [aberto, setAberto] = useState(false);
  const visiveis = filterCombobox(grupos, texto, limit);
  return (
    <Combobox
      opened={aberto && visiveis.length > 0 && !disabled}
      onOpenedChange={setAberto}
      maxDropdownHeight={maxDropdownHeight}
      disabled={disabled}
      onOptionSubmit={(v) => {
        const rotulo = visiveis.flatMap((g) => g.items).find((i) => i.value === v)?.label ?? v;
        setTexto(rotulo);
        onOptionSubmit?.(v);
        setAberto(false);
      }}
    >
      <Combobox.Target>
        <InputBase
          {...rest}
          component="input"
          disabled={disabled}
          value={texto}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setTexto(e.currentTarget.value);
            setAberto(true);
          }}
          onFocus={(e: FocusEvent<HTMLInputElement>) => {
            setAberto(true);
            onFocus?.(e);
          }}
        />
      </Combobox.Target>
      <Combobox.Dropdown>
        <ComboboxOptions grupos={visiveis} escolhidos={[]} withCheckIcon={false} />
      </Combobox.Dropdown>
    </Combobox>
  );
}
