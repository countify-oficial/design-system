import { useComponentProps } from "@countify-oficial/provider";
import { resolveSpacing, type Spacing } from "@countify-oficial/tokens";
import { Children, type ElementType } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import type { PolymorphicProps } from "../polymorphic";
import { useThemeStyle } from "../styles";

export interface GroupOwnProps {
  /** Espaço entre os itens: xs–xl ou degrau da grade de 4 (3 = 12). Padrão: md. */
  gap?: Spacing | undefined;
  /** alignItems. Padrão: center. */
  align?: ViewStyle["alignItems"];
  /** justifyContent. Padrão: flex-start. */
  justify?: ViewStyle["justifyContent"];
  /** Quebra a linha quando não cabe. Padrão: true. */
  wrap?: boolean | undefined;
  /** Os itens crescem para ocupar a linha (cada um vai numa View com flexGrow). */
  grow?: boolean | undefined;
  style?: StyleProp<ViewStyle>;
}

export type GroupProps<C extends ElementType = typeof View> = PolymorphicProps<C, GroupOwnProps>;

const s = StyleSheet.create({ cresce: { flexGrow: 1 } });

/** Itens lado a lado, alinhados ao centro, com espaço entre eles. */
export function Group<C extends ElementType = typeof View>(props: GroupProps<C>) {
  const { component, gap = "md", align = "center", justify, wrap = true, grow, style, children, ...rest } = useComponentProps("Group", {}, props);
  const doTema = useThemeStyle("Group");
  const Component: ElementType = component ?? View;
  return (
    <Component
      {...rest}
      style={[
        { flexDirection: "row", flexWrap: wrap ? "wrap" : "nowrap", gap: resolveSpacing(gap), alignItems: align, justifyContent: justify },
        doTema,
        style,
      ]}
    >
      {grow ? Children.map(children, (filho) => <View style={s.cresce}>{filho}</View>) : children}
    </Component>
  );
}
