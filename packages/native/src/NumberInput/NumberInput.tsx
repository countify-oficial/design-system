import { useControllableState } from "@countify-oficial/hooks";
import { formatNumber, numberSeparators, parseNumber, useComponentProps, useCountifyTheme, useMessages } from "@countify-oficial/provider";
import { fontSize, nativeFontFamily } from "@countify-oficial/tokens";
import { useState } from "react";
import { Text as RNText, View } from "react-native";
import { ActionIcon } from "../ActionIcon/ActionIcon";
import { Icon } from "../Icon/Icon";
import { InputBase, type InputBaseProps } from "../Input/Input";

export type NumberInputProps = Omit<InputBaseProps, "rows" | "value" | "defaultValue" | "onChange" | "onChangeText" | "rightSection"> & {
  value?: number | "" | undefined;
  defaultValue?: number | "" | undefined;
  onChange?: ((value: number | "") => void) | undefined;
  min?: number | undefined;
  max?: number | undefined;
  step?: number | undefined;
  decimalScale?: number | undefined;
  fixedDecimalScale?: boolean | undefined;
  allowNegative?: boolean | undefined;
  /** Botões − e + (44 cada). Padrão: false. */
  withControls?: boolean | undefined;
  /** Unidade depois do número (%, m²). */
  suffix?: string | undefined;
  locale?: string | undefined;
};

/** Campo de número no formato do idioma (1.284,5), com teclado numérico do sistema. */
export function NumberInput(props: NumberInputProps) {
  const messages = useMessages();
  const { locale: doProvider, colors: c } = useCountifyTheme();
  const {
    value, defaultValue, onChange, min, max, step = 1, decimalScale, fixedDecimalScale, allowNegative = true, withControls, suffix,
    locale = doProvider, onFocus, onBlur, disabled, ...rest
  } = useComponentProps("NumberInput", {}, props);
  const [numero, setNumero] = useControllableState<number | "">({ value, defaultValue: defaultValue ?? "", onChange });
  const [texto, setTexto] = useState<string | null>(null);
  const { decimal } = numberSeparators(locale);
  const limitar = (n: number) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n));
  const formatado = numero === "" ? "" : formatNumber(numero, { locale, decimalScale, fixedDecimalScale });
  const passo = (sinal: 1 | -1) => {
    setNumero(limitar(Number(((numero === "" ? (min ?? 0) : numero) + sinal * step).toFixed(10))));
    setTexto(null);
  };
  const unidade = suffix !== undefined && <RNText style={{ color: c.text2, fontSize: fontSize.md, fontFamily: nativeFontFamily[400] }}>{suffix}</RNText>;
  return (
    <InputBase
      keyboardType={allowNegative ? "numbers-and-punctuation" : "decimal-pad"}
      accessibilityValue={numero === "" ? undefined : { now: numero, ...(min === undefined ? {} : { min }), ...(max === undefined ? {} : { max }) }}
      {...rest}
      disabled={disabled}
      value={texto ?? formatado}
      onChangeText={(t) => {
        const permitidos = new RegExp(`[^\\d${decimal === "." ? "\\." : decimal}${allowNegative ? "-" : ""}]`, "g");
        const limpo = t.replace(permitidos, "");
        setTexto(limpo);
        const n = parseNumber(limpo, locale);
        setNumero(n === undefined ? "" : n);
      }}
      onFocus={(e) => {
        setTexto(numero === "" ? "" : formatNumber(numero, { locale, format: { useGrouping: false, maximumFractionDigits: 20 } }));
        onFocus?.(e);
      }}
      onBlur={(e) => {
        if (numero !== "") setNumero(limitar(numero));
        setTexto(null);
        onBlur?.(e);
      }}
      rightSection={
        withControls ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {unidade}
            <ActionIcon accessibilityLabel={messages.decrement} color="text2" disabled={disabled || (numero !== "" && min !== undefined && numero <= min)} onPress={() => passo(-1)}><Icon name="minus" /></ActionIcon>
            <ActionIcon accessibilityLabel={messages.increment} color="text2" disabled={disabled || (numero !== "" && max !== undefined && numero >= max)} onPress={() => passo(1)}><Icon name="plus" /></ActionIcon>
          </View>
        ) : unidade || undefined
      }
    />
  );
}
