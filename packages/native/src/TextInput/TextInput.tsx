import { useComponentProps } from "@countify-oficial/provider";
import { InputBase, type InputBaseProps } from "../Input/Input";

export type TextInputProps = Omit<InputBaseProps, "rows">;

/** Campo de texto com rótulo: o "Campo" do mockup (48, fundo de campo, rótulo sempre visível). */
export function TextInput(props: TextInputProps) {
  const p = useComponentProps("TextInput", {}, props);
  return <InputBase {...p} />;
}
