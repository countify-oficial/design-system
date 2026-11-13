import { useComponentProps } from "@countify-oficial/provider";
import { InputBase, type InputBaseOwnProps } from "../Input/Input";
import type { PolymorphicProps } from "../polymorphic";

export type TextareaProps = PolymorphicProps<
  "textarea",
  InputBaseOwnProps & {
    /** Cresce com o texto, entre minRows e maxRows (navegadores com field-sizing). */
    autosize?: boolean | undefined;
    /** Linhas no mínimo. Padrão: 3. */
    minRows?: number | undefined;
    /** Linhas no máximo, com autosize. Padrão: 8. */
    maxRows?: number | undefined;
  }
>;

/** Campo de várias linhas. */
export function Textarea(props: TextareaProps) {
  const { autosize, minRows = 3, maxRows = 8, rows, styles, ...rest } = useComponentProps("Textarea", {}, props);
  const linhas = { "--input-min-rows": minRows, "--input-max-rows": maxRows } as React.CSSProperties;
  return (
    <InputBase
      rows={rows ?? minRows}
      data-multiline
      data-autosize={autosize || undefined}
      {...rest}
      styles={{ ...styles, input: { ...linhas, ...styles?.input } }}
      component="textarea"
    />
  );
}
