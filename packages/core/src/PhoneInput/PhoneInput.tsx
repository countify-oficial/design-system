import { useControllableState } from "@countify-oficial/hooks";
import { applyMask, phoneMask, useComponentProps } from "@countify-oficial/provider";
import type { ChangeEvent } from "react";
import { InputBase, type InputBaseOwnProps } from "../Input/Input";
import type { PolymorphicProps } from "../polymorphic";

export type PhoneInputProps = PolymorphicProps<
  "input",
  InputBaseOwnProps & {
    value?: string | undefined;
    defaultValue?: string | undefined;
    /** Chamado com o telefone formatado e só os algarismos (com DDD). */
    onChange?: ((formatted: string, digits: string) => void) | undefined;
  }
>;

const formatar = (t: string) => applyMask(t, phoneMask(t));

/** Telefone do Brasil com DDD; a máscara muda entre fixo e celular conforme a quantidade de algarismos. */
export function PhoneInput(props: PhoneInputProps) {
  const { value, defaultValue, onChange, ...rest } = useComponentProps("PhoneInput", {}, props);
  const [texto, setTexto] = useControllableState({
    value: value === undefined ? undefined : formatar(value).masked,
    defaultValue: formatar(defaultValue ?? "").masked,
    onChange: (f: string) => onChange?.(f, formatar(f).raw),
  });
  return (
    <InputBase
      type="tel"
      inputMode="tel"
      autoComplete="tel-national"
      {...rest}
      component="input"
      value={texto}
      onChange={(e: ChangeEvent<HTMLInputElement>) => setTexto(formatar(e.currentTarget.value).masked)}
    />
  );
}
