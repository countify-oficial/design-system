import type { ElementType } from "react";
import { View } from "react-native";
import type { PolymorphicProps } from "../polymorphic";

export type BoxProps<C extends ElementType = typeof View> = PolymorphicProps<C>;

/** Elemento base: uma View, ou o componente de `component`, com as props e o ref dele. */
export function Box<C extends ElementType = typeof View>({ component, ...props }: BoxProps<C>) {
  const Component: ElementType = component ?? View;
  return <Component {...props} />;
}
