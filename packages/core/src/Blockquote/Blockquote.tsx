import { useComponentProps } from "@countify-oficial/provider";
import type { Tone } from "@countify-oficial/tokens";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { toneVars, useStyles, type StylesApiProps } from "../styles";
import classes from "./Blockquote.module.css";

export interface BlockquoteProps
  extends StylesApiProps<"root" | "icon" | "body" | "cite">, Omit<ComponentPropsWithRef<"blockquote">, "className" | "style" | "color" | "cite"> {
  /** Tom da barra e do fundo. Padrão: accent. */
  color?: Tone | undefined;
  /** Quem disse. */
  cite?: ReactNode;
  icon?: ReactNode;
}

/** Citação, com barra na cor do tom e autor. */
export function Blockquote(props: BlockquoteProps) {
  const { color = "accent", cite, icon, children, className, style, classNames, styles, ...rest } = useComponentProps("Blockquote", {}, props);
  const getStyles = useStyles("Blockquote", classes, { className, style, classNames, styles });
  return (
    <blockquote {...rest} {...getStyles("root", toneVars(color))}>
      {icon !== undefined && <span {...getStyles("icon")}>{icon}</span>}
      <div {...getStyles("body")}>
        <div>{children}</div>
        {cite !== undefined && <cite {...getStyles("cite")}>{cite}</cite>}
      </div>
    </blockquote>
  );
}
