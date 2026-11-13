import { useComponentProps } from "@countify-oficial/provider";
import type { ColorRole } from "@countify-oficial/tokens";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { colorVar, useStyles, type StylesApiProps } from "../styles";
import classes from "./Divider.module.css";

export interface DividerProps extends StylesApiProps, Omit<ComponentPropsWithRef<"div">, "className" | "style" | "children" | "color"> {
  /** Padrão: horizontal. */
  orientation?: "horizontal" | "vertical" | undefined;
  /** Linha cheia ou tracejada. Padrão: solid. */
  variant?: "solid" | "dashed" | undefined;
  /** Papel de cor da linha. Padrão: divider. */
  color?: ColorRole | undefined;
  /** Texto no meio da linha (só na horizontal). */
  label?: ReactNode;
  /** Onde fica o texto. Padrão: center. */
  labelPosition?: "left" | "center" | "right" | undefined;
}

/** Linha que separa conteúdos, na cor da divisória. */
export function Divider(props: DividerProps) {
  const {
    orientation = "horizontal", variant = "solid", color = "divider", label, labelPosition = "center",
    className, style, classNames, styles, ...rest
  } = useComponentProps("Divider", {}, props);
  const getStyles = useStyles("Divider", classes, { className, style, classNames, styles });
  const comTexto = label !== undefined && orientation === "horizontal";
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      {...rest}
      data-orientation={orientation}
      data-with-label={comTexto || undefined}
      data-label-position={comTexto ? labelPosition : undefined}
      {...getStyles("root", { "--divider-style": variant, "--divider-color": colorVar(color) })}
    >
      {comTexto ? label : null}
    </div>
  );
}
