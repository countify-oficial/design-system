import { useComponentProps } from "@countify-oficial/provider";
import type { Tone } from "@countify-oficial/tokens";
import type { ComponentPropsWithRef } from "react";
import { toneVars, useStyles, type StylesApiProps } from "../styles";
import classes from "./Mark.module.css";

export interface MarkProps extends StylesApiProps, Omit<ComponentPropsWithRef<"mark">, "className" | "style" | "color"> {
  /** Tom do fundo (o claro do tom). Padrão: warn (âmbar, o mais perto de um marca-texto). */
  color?: Tone | undefined;
}

/** Trecho marcado no texto (<mark>). */
export function Mark(props: MarkProps) {
  const { color = "warn", className, style, classNames, styles, ...rest } = useComponentProps("Mark", {}, props);
  const getStyles = useStyles("Mark", classes, { className, style, classNames, styles });
  return <mark {...rest} {...getStyles("root", toneVars(color))} />;
}
