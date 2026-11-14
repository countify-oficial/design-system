import { useControllableState } from "@countify-oficial/hooks";
import { formatNumber, limitNumber, numberSeparators, parseNumber, useComponentProps, useCountifyTheme, useMessages } from "@countify-oficial/provider";
import { useState, type ChangeEvent, type FocusEvent, type KeyboardEvent } from "react";
import { ActionIcon } from "../ActionIcon/ActionIcon";
import { Group } from "../Group/Group";
import { Icon } from "../Icon/Icon";
import { InputBase, type InputBaseOwnProps } from "../Input/Input";
import type { PolymorphicProps } from "../polymorphic";

export type NumberInputProps = PolymorphicProps<
  "input",
  Omit<InputBaseOwnProps, "rightSection"> & {
    /** Valor (controlado); "" quando vazio. */
    value?: number | "" | undefined;
    defaultValue?: number | "" | undefined;
    onChange?: ((value: number | "") => void) | undefined;
    min?: number | undefined;
    max?: number | undefined;
    /** Passo das setas do teclado e dos botões. Padrão: 1. */
    step?: number | undefined;
    /** Casas decimais no máximo. */
    decimalScale?: number | undefined;
    /** Mostra sempre as casas de decimalScale ao sair do campo. */
    fixedDecimalScale?: boolean | undefined;
    /** Aceita negativo. Padrão: true. */
    allowNegative?: boolean | undefined;
    /** Botões − e + (44 cada). A identidade usa campo sem botões; padrão: false. */
    withControls?: boolean | undefined;
    /** Texto depois do número, fora do campo (%, m², p.p.). */
    suffix?: string | undefined;
    /** Idioma do número. Padrão: o do provider. */
    locale?: string | undefined;
  }
>;

/** Campo de número no formato do idioma (1.284,5), com mínimo, máximo e passo. */
export function NumberInput(props: NumberInputProps) {
  const messages = useMessages();
  const { locale: doProvider } = useCountifyTheme();
  const {
    value, defaultValue, onChange, min, max, step = 1, decimalScale, fixedDecimalScale, allowNegative = true, withControls,
    suffix, locale = doProvider, onBlur, onFocus, onKeyDown, disabled, ...rest
  } = useComponentProps("NumberInput", {}, props);
  const [numero, setNumero] = useControllableState<number | "">({ value, defaultValue: defaultValue ?? "", onChange });
  const formatado = (n: number | "") => (n === "" ? "" : formatNumber(n, { locale, decimalScale, fixedDecimalScale, format: { useGrouping: true } }));
  const [texto, setTexto] = useState<string | null>(null);
  const { decimal } = numberSeparators(locale);
  // entre min e max, nas casas de decimalScale: o valor que fica é o que o campo mostra
  const limitar = (n: number) => limitNumber(n, { min, max, decimalScale });
  const passo = (sinal: 1 | -1) => {
    const base = numero === "" ? (min ?? 0) : numero;
    const novo = limitar(Number((base + sinal * step).toFixed(10)));
    setNumero(novo);
    setTexto(null);
  };
  const aoDigitar = (e: ChangeEvent<HTMLInputElement>) => {
    const permitidos = new RegExp(`[^\\d${decimal === "." ? "\\." : decimal}${allowNegative ? "-" : ""}]`, "g");
    const t = e.currentTarget.value.replace(permitidos, "");
    setTexto(t);
    const n = parseNumber(t, locale);
    setNumero(n === undefined ? "" : n);
  };
  return (
    <InputBase
      inputMode={decimalScale === 0 ? "numeric" : "decimal"}
      role="spinbutton"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={numero === "" ? undefined : numero}
      {...rest}
      disabled={disabled}
      component="input"
      type="text"
      value={texto ?? formatado(numero)}
      onChange={aoDigitar}
      onFocus={(e: FocusEvent<HTMLInputElement>) => {
        setTexto(numero === "" ? "" : formatNumber(numero, { locale, format: { useGrouping: false, maximumFractionDigits: 20 } }));
        onFocus?.(e);
      }}
      onBlur={(e: FocusEvent<HTMLInputElement>) => {
        if (numero !== "") setNumero(limitar(numero));
        setTexto(null);
        onBlur?.(e);
      }}
      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(e);
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
          e.preventDefault();
          passo(e.key === "ArrowUp" ? 1 : -1);
        }
      }}
      rightSection={
        withControls ? (
          <Group gap={0} wrap={false}>
            {suffix}
            <ActionIcon aria-label={messages.decrement} color="text2" disabled={disabled || (numero !== "" && min !== undefined && numero <= min)} onClick={() => passo(-1)}><Icon name="minus" /></ActionIcon>
            <ActionIcon aria-label={messages.increment} color="text2" disabled={disabled || (numero !== "" && max !== undefined && numero >= max)} onClick={() => passo(1)}><Icon name="plus" /></ActionIcon>
          </Group>
        ) : (
          suffix
        )
      }
    />
  );
}
