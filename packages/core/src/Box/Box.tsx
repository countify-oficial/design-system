import type { ElementType } from "react";
import type { PolymorphicProps } from "../polymorphic";

export type BoxProps<C extends ElementType = "div"> = PolymorphicProps<C>;

/** Elemento base: um div, ou o elemento ou componente de `component`, com as props e o ref dele. */
export function Box<C extends ElementType = "div">({ component, ...props }: BoxProps<C>) {
  const Component: ElementType = component ?? "div";
  return <Component {...props} />;
}
