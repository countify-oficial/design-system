import { useControllableState } from "@countify-oficial/hooks";
import { applyMask, useComponentProps } from "@countify-oficial/provider";
import { InputBase, type InputBaseProps } from "../Input/Input";

export type MaskInputProps = Omit<InputBaseProps, "rows" | "value" | "defaultValue" | "onChange" | "onChangeText"> & {
  /** 9 = algarismo, a = letra, * = qualquer um; o resto é fixo. */
  mask: string;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((masked: string, raw: string) => void) | undefined;
};

/** Campo com máscara (CPF, CNPJ, CEP, placa…). */
export function MaskInput(props: MaskInputProps) {
  const { mask, value, defaultValue, onChange, ...rest } = useComponentProps("MaskInput", {}, props);
  const [texto, setTexto] = useControllableState({
    value: value === undefined ? undefined : applyMask(value, mask).masked,
    defaultValue: applyMask(defaultValue ?? "", mask).masked,
    onChange: (m: string) => onChange?.(m, applyMask(m, mask).raw),
  });
  return <InputBase {...rest} value={texto} onChangeText={(t) => setTexto(applyMask(t, mask).masked)} maxLength={mask.length} />;
}
