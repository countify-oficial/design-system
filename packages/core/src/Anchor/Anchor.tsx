import { useComponentProps } from "@countify-oficial/provider";
import type { ElementType } from "react";
import { cx } from "../styles";
import { Text, type TextProps } from "../Text/Text";
import classes from "./Anchor.module.css";

export type AnchorProps<C extends ElementType = "a"> = TextProps<C> & {
  /** Sublinhado: no hover, sempre ou nunca. Padrão: hover. */
  underline?: "hover" | "always" | "never" | undefined;
};

/** Link no texto, na cor de destaque. Aceita as props do Text; é um <a>, ou o componente de `component` (o Link do roteador). */
export function Anchor<C extends ElementType = "a">(props: AnchorProps<C>) {
  const { underline = "hover", className, ...rest } = useComponentProps("Anchor", {}, props);
  const texto = { component: "a", color: "accent", inherit: true, ...rest, className: cx(classes["root"], className) } as TextProps<C>;
  return <Text data-underline={underline} {...texto} />;
}
