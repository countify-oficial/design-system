import { useControllableState } from "@countify-oficial/hooks";
import { filterCombobox, mentionQuery, parseComboboxData, useComponentProps, useCountifyTheme, type ComboboxData } from "@countify-oficial/provider";
import { borderWidth, radius, space } from "@countify-oficial/tokens";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { Combobox, ComboboxOptions } from "../Combobox/Combobox";
import type { InputBaseProps } from "../Input/Input";
import { Textarea } from "../Textarea/Textarea";

export type MentionsProps = Omit<InputBaseProps, "rows" | "value" | "defaultValue" | "onChange" | "onChangeText"> & {
  data: ComboboxData;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  /** O que abre a lista. Padrão: "@". */
  prefix?: string | undefined;
  limit?: number | undefined;
  minRows?: number | undefined;
};

/** Texto com menções: "@" mostra as pessoas logo abaixo do campo; tocar põe "@Nome " no texto. */
export function Mentions(props: MentionsProps) {
  const { data, value, defaultValue, onChange, prefix = "@", limit = 5, minRows = 3, onSelectionChange, ...rest } = useComponentProps("Mentions", {}, props);
  const { colors: c } = useCountifyTheme();
  const grupos = useMemo(() => parseComboboxData(data), [data]);
  const [texto, setTexto] = useControllableState({ value, defaultValue: defaultValue ?? "", onChange });
  // shortcut: sem evento de seleção depois da digitação, a menção é a do fim do texto; basta para quem digita no fim
  const [cursor, setCursor] = useState<number | null>(null);
  const fim = cursor ?? texto.length;
  const consulta = mentionQuery(texto, fim, prefix);
  const opcoes = consulta ? filterCombobox(grupos, consulta.busca, limit) : [];
  return (
    <Combobox
      onOptionSubmit={(v) => {
        if (!consulta) return;
        const rotulo = opcoes.flatMap((g) => g.items).find((i) => i.value === v)?.label ?? v;
        setTexto(`${texto.slice(0, consulta.inicio)}${prefix}${rotulo} ${texto.slice(fim)}`);
        setCursor(null);
      }}
    >
      <Textarea
        {...rest}
        minRows={minRows}
        value={texto}
        onChangeText={(t) => {
          setTexto(t);
          setCursor(null);
        }}
        onSelectionChange={(e) => {
          setCursor(e.nativeEvent.selection.start);
          onSelectionChange?.(e);
        }}
      />
      {opcoes.length > 0 && (
        <View accessibilityRole="menu" style={{ marginTop: space[1], paddingHorizontal: space[2], borderRadius: radius.md, backgroundColor: c.card, borderWidth: borderWidth.thin, borderColor: c.divider }}>
          <ComboboxOptions grupos={opcoes} escolhidos={[]} withCheckIcon={false} />
        </View>
      )}
    </Combobox>
  );
}
