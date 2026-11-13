import { useComponentProps } from "@countify-oficial/provider";
import type { Spacing } from "@countify-oficial/tokens";
import type { ComponentPropsWithRef } from "react";
import { spacingVar, useStyles, type StylesApiProps } from "../styles";
import classes from "./Space.module.css";

export interface SpaceProps extends StylesApiProps, Omit<ComponentPropsWithRef<"div">, "className" | "style" | "children"> {
  /** Altura: xs–xl ou degrau da grade de 4 (3 = 12). */
  h?: Spacing | undefined;
  /** Largura: xs–xl ou degrau da grade de 4 (3 = 12). */
  w?: Spacing | undefined;
}

/** Espaço vazio entre dois elementos (altura h, largura w). */
export function Space(props: SpaceProps) {
  const { h, w, className, style, classNames, styles, ...rest } = useComponentProps("Space", {}, props);
  const getStyles = useStyles("Space", classes, { className, style, classNames, styles });
  return <div aria-hidden {...rest} {...getStyles("root", { "--space-h": spacingVar(h), "--space-w": spacingVar(w) })} />;
}
