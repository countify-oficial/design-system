import { useControllableState } from "@countify-oficial/hooks";
import { filterCombobox, parseComboboxData, useComponentProps, useCountifyTheme, type ComboboxData } from "@countify-oficial/provider";
import { borderWidth, radius, space } from "@countify-oficial/tokens";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { Combobox, ComboboxOptions } from "../Combobox/Combobox";
import type { InputBaseProps } from "../Input/Input";
import { TextInput } from "../TextInput/TextInput";

export type AutocompleteProps = Omit<InputBaseProps, "rows" | "value" | "defaultValue" | "onChange" | "onChangeText"> & {
  data: ComboboxData;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  onOptionSubmit?: ((value: string) => void) | undefined;
  limit?: number | undefined;
};

/** Texto livre com sugestões logo abaixo do campo enquanto digita. */
export function Autocomplete(props: AutocompleteProps) {
  const { data, value, defaultValue, onChange, onOptionSubmit, limit = 5, onFocus, onBlur, ...rest } = useComponentProps("Autocomplete", {}, props);
  const { colors: c } = useCountifyTheme();
  const grupos = useMemo(() => parseComboboxData(data), [data]);
  const [texto, setTexto] = useControllableState({ value, defaultValue: defaultValue ?? "", onChange });
  const [focado, setFocado] = useState(false);
  const visiveis = filterCombobox(grupos, texto, limit);
  return (
    <Combobox onOptionSubmit={(v) => { setTexto(visiveis.flatMap((g) => g.items).find((i) => i.value === v)?.label ?? v); onOptionSubmit?.(v); setFocado(false); }}>
      <TextInput
        {...rest}
        value={texto}
        onChangeText={setTexto}
        onFocus={(e) => { setFocado(true); onFocus?.(e); }}
        onBlur={(e) => { setFocado(false); onBlur?.(e); }}
      />
      {focado && texto !== "" && visiveis.length > 0 && (
        <View accessibilityRole="menu" style={{ marginTop: space[1], paddingHorizontal: space[2], borderRadius: radius.md, backgroundColor: c.card, borderWidth: borderWidth.thin, borderColor: c.divider }}>
          <ComboboxOptions grupos={visiveis} escolhidos={[]} withCheckIcon={false} />
        </View>
      )}
    </Combobox>
  );
}
