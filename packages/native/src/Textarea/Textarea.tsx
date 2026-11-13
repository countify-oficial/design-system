import { useComponentProps } from "@countify-oficial/provider";
import { InputBase, type InputBaseProps } from "../Input/Input";

export type TextareaProps = Omit<InputBaseProps, "rows"> & {
  /** Linhas no mínimo. Padrão: 3. */
  minRows?: number | undefined;
};

/** Campo de várias linhas. */
export function Textarea(props: TextareaProps) {
  const { minRows = 3, ...rest } = useComponentProps("Textarea", {}, props);
  return <InputBase {...rest} rows={minRows} />;
}
