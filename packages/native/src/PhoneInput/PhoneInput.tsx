import { useControllableState } from "@countify-oficial/hooks";
import { applyMask, phoneMask, useComponentProps } from "@countify-oficial/provider";
import { InputBase, type InputBaseProps } from "../Input/Input";

export type PhoneInputProps = Omit<InputBaseProps, "rows" | "value" | "defaultValue" | "onChange" | "onChangeText"> & {
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((formatted: string, digits: string) => void) | undefined;
};

const formatar = (t: string) => applyMask(t, phoneMask(t));

/** Telefone do Brasil com DDD; a máscara muda entre fixo e celular. */
export function PhoneInput(props: PhoneInputProps) {
  const { value, defaultValue, onChange, ...rest } = useComponentProps("PhoneInput", {}, props);
  const [texto, setTexto] = useControllableState({
    value: value === undefined ? undefined : formatar(value).masked,
    defaultValue: formatar(defaultValue ?? "").masked,
    onChange: (f: string) => onChange?.(f, formatar(f).raw),
  });
  return <InputBase keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" {...rest} value={texto} onChangeText={(t) => setTexto(formatar(t).masked)} />;
}
