import { useComponentProps } from "@countify-oficial/provider";
import { InputBase, type InputBaseOwnProps } from "../Input/Input";
import type { PolymorphicProps } from "../polymorphic";

export type TextInputProps = PolymorphicProps<"input", InputBaseOwnProps>;

/** Campo de texto com rótulo: o "Campo" do mockup (48, fundo de campo, rótulo sempre visível). */
export function TextInput(props: TextInputProps) {
  const p = useComponentProps("TextInput", {}, props);
  return <InputBase type="text" {...p} component="input" />;
}
