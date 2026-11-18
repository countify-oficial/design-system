import { useControllableState, useDebounce } from "@countify-oficial/hooks";
import { hasContent, useComponentProps, useMessages } from "@countify-oficial/provider";
import { useEffect, useRef } from "react";
import { CloseButton } from "../CloseButton/CloseButton";
import { Icon } from "../Icon/Icon";
import { InputBase, type InputBaseProps } from "../Input/Input";

/** A API do core, menos o atalho de teclado (`shortcut`) e o Esc: o celular não tem teclado físico. */
export type SearchInputProps = Omit<InputBaseProps, "rows" | "rightSection" | "value" | "defaultValue" | "onChange" | "onChangeText"> & {
  /** Texto da busca (controlado). */
  value?: string | undefined;
  /** Texto inicial (não controlado). */
  defaultValue?: string | undefined;
  /** Chamado a cada mudança do texto, inclusive ao limpar (com ""). */
  onChange?: ((value: string) => void) | undefined;
  /** Chamado com o texto da busca depois de `debounce` ms sem digitar (e com "" ao limpar). */
  onSearch?: ((value: string) => void) | undefined;
  /** Espera, em ms, entre a última tecla e o onSearch. Padrão: 0 (busca a cada mudança). */
  debounce?: number | undefined;
};

/** Campo de busca do mockup ("Busca no topo da lista"): lupa à esquerda e × para limpar. */
export function SearchInput(props: SearchInputProps) {
  const messages = useMessages();
  const {
    value, defaultValue, onChange, onSearch, debounce = 0, disabled, label, leftSection = <Icon name="search" />, placeholder = messages.search,
    accessibilityLabel, ...rest
  } = useComponentProps("SearchInput", {}, props);
  const [texto, setTexto] = useControllableState({ value, defaultValue: defaultValue ?? "", onChange });

  const buscado = useDebounce(texto, debounce);
  const ultimaBusca = useRef(buscado);
  useEffect(() => {
    if (buscado === ultimaBusca.current) return;
    ultimaBusca.current = buscado;
    onSearch?.(buscado);
  }, [buscado, onSearch]);

  return (
    <InputBase
      returnKeyType="search"
      {...rest}
      role="searchbox"
      label={label}
      accessibilityLabel={accessibilityLabel ?? (hasContent(label) ? undefined : messages.search)}
      placeholder={placeholder}
      disabled={disabled}
      leftSection={leftSection}
      value={texto}
      onChangeText={setTexto}
      rightSection={texto !== "" ? <CloseButton accessibilityLabel={messages.clearSearch} color="text2" disabled={disabled} onPress={() => setTexto("")} /> : undefined}
    />
  );
}
