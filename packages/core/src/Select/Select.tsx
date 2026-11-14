import { useControllableState } from "@countify-oficial/hooks";
import { allItems, filterCombobox, parseComboboxData, useComponentProps, useMessages, type ComboboxData, type ComboboxItem } from "@countify-oficial/provider";
import { useMemo, useState, type ChangeEvent, type ReactNode } from "react";
import { CloseButton } from "../CloseButton/CloseButton";
import { Combobox } from "../Combobox/Combobox";
import { ComboboxOptions } from "../Combobox/Options";
import { Icon } from "../Icon/Icon";
import { InputBase, type InputBaseOwnProps } from "../Input/Input";
import type { PolymorphicProps } from "../polymorphic";

export type SelectProps = PolymorphicProps<
  "input",
  Omit<InputBaseOwnProps, "rightSection"> & {
    data: ComboboxData;
    value?: string | null | undefined;
    defaultValue?: string | null | undefined;
    onChange?: ((value: string | null, item: ComboboxItem | null) => void) | undefined;
    /** Deixa digitar para filtrar as opções. */
    searchable?: boolean | undefined;
    /** Botão de limpar quando há valor. */
    clearable?: boolean | undefined;
    /** Escolher a já escolhida tira a escolha. Padrão: true. */
    allowDeselect?: boolean | undefined;
    /** Texto quando a busca não acha nada. Padrão: "Nada encontrado". */
    nothingFoundMessage?: ReactNode;
    /** Quantas opções mostrar no máximo. */
    limit?: number | undefined;
    maxDropdownHeight?: number | string | undefined;
    withCheckIcon?: boolean | undefined;
  }
>;

/** Escolhe um valor de uma lista; com searchable, filtra digitando. Setas, Enter e Esc funcionam. */
export function Select(props: SelectProps) {
  const messages = useMessages();
  const {
    data, value, defaultValue, onChange, searchable, clearable, allowDeselect = true, nothingFoundMessage = messages.nothingFound, limit, maxDropdownHeight, withCheckIcon,
    disabled, onBlur, onClick, ...rest
  } = useComponentProps("Select", {}, props);
  const grupos = useMemo(() => parseComboboxData(data), [data]);
  const itens = useMemo(() => allItems(grupos), [grupos]);
  const [valor, setValor] = useControllableState<string | null>({
    value, defaultValue: defaultValue ?? null, onChange: (v) => onChange?.(v, itens.find((i) => i.value === v) ?? null),
  });
  const [busca, setBusca] = useState<string | null>(null);
  const [aberto, setAberto] = useState(false);
  const escolhido = itens.find((i) => i.value === valor);
  const visiveis = filterCombobox(grupos, searchable ? (busca ?? "") : "", limit);
  return (
    <Combobox
      opened={aberto && !disabled}
      onOpenedChange={setAberto}
      role={searchable ? "combobox" : "select"}
      maxDropdownHeight={maxDropdownHeight}
      disabled={disabled}
      onOptionSubmit={(v) => {
        setValor(allowDeselect && v === valor ? null : v);
        setBusca(null);
        setAberto(false);
      }}
    >
      <Combobox.Target>
        <InputBase
          {...rest}
          component="input"
          disabled={disabled}
          readOnly={!searchable}
          value={busca ?? escolhido?.label ?? ""}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setBusca(e.currentTarget.value);
            setAberto(true);
          }}
          onClick={(e: React.MouseEvent<HTMLInputElement>) => {
            setAberto(!aberto);
            onClick?.(e);
          }}
          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
            setBusca(null);
            onBlur?.(e);
          }}
          rightSection={
            clearable && valor !== null ? <CloseButton aria-label={messages.clear} color="text2" onClick={() => setValor(null)} /> : <Icon name="chevron-down" />
          }
          rightSectionPointerEvents={clearable && valor !== null ? "auto" : "none"}
        />
      </Combobox.Target>
      <Combobox.Dropdown>
        <ComboboxOptions grupos={visiveis} escolhidos={valor === null ? [] : [valor]} vazio={nothingFoundMessage} withCheckIcon={withCheckIcon} />
      </Combobox.Dropdown>
    </Combobox>
  );
}
