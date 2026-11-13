import { useComponentProps } from "@countify-oficial/provider";
import type { ComponentPropsWithRef } from "react";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./Kbd.module.css";

export type KbdProps = StylesApiProps & Omit<ComponentPropsWithRef<"kbd">, "className" | "style">;

/** Tecla do teclado (Ctrl, K…), em letra de largura fixa. */
export function Kbd(props: KbdProps) {
  const { className, style, classNames, styles, ...rest } = useComponentProps("Kbd", {}, props);
  const getStyles = useStyles("Kbd", classes, { className, style, classNames, styles });
  return <kbd {...rest} {...getStyles("root")} />;
}
