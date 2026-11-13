import { useControllableState } from "@countify-oficial/hooks";
import { applyMask, useComponentProps } from "@countify-oficial/provider";
import type { ChangeEvent } from "react";
import { InputBase, type InputBaseOwnProps } from "../Input/Input";
import type { PolymorphicProps } from "../polymorphic";

export type MaskInputProps = PolymorphicProps<
  "input",
  InputBaseOwnProps & {
    /** 9 = algarismo, a = letra, * = qualquer um; o resto é fixo. Ex.: "999.999.999-99" (CPF), "99999-999" (CEP). */
    mask: string;
    /** Valor com a máscara (controlado). */
    value?: string | undefined;
    defaultValue?: string | undefined;
    /** Chamado com o texto com máscara e só o digitado. */
    onChange?: ((masked: string, raw: string) => void) | undefined;
  }
>;

/** Campo com máscara (CPF, CNPJ, CEP, placa…). */
export function MaskInput(props: MaskInputProps) {
  const { mask, value, defaultValue, onChange, ...rest } = useComponentProps("MaskInput", {}, props);
  const [texto, setTexto] = useControllableState({
    value: value === undefined ? undefined : applyMask(value, mask).masked,
    defaultValue: applyMask(defaultValue ?? "", mask).masked,
    onChange: (m: string) => onChange?.(m, applyMask(m, mask).raw),
  });
  return (
    <InputBase
      {...rest}
      component="input"
      value={texto}
      onChange={(e: ChangeEvent<HTMLInputElement>) => setTexto(applyMask(e.currentTarget.value, mask).masked)}
      maxLength={mask.length}
    />
  );
}
