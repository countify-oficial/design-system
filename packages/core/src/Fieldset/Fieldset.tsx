import { useComponentProps } from "@countify-oficial/provider";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./Fieldset.module.css";

export interface FieldsetProps extends StylesApiProps<"root" | "legend">, Omit<ComponentPropsWithRef<"fieldset">, "className" | "style"> {
  /** Título do grupo. */
  legend?: ReactNode;
  /** default: cartão com anel; filled: fundo de chip; unstyled: sem nada. Padrão: default. */
  variant?: "default" | "filled" | "unstyled" | undefined;
}

/** Agrupa campos com um título (<fieldset>); disabled desliga todos os de dentro. */
export function Fieldset(props: FieldsetProps) {
  const { legend, variant = "default", children, className, style, classNames, styles, ...rest } = useComponentProps("Fieldset", {}, props);
  const getStyles = useStyles("Fieldset", classes, { className, style, classNames, styles });
  return (
    <fieldset {...rest} data-variant={variant} {...getStyles("root")}>
      {legend !== undefined && <legend {...getStyles("legend")}>{legend}</legend>}
      {children}
    </fieldset>
  );
}
