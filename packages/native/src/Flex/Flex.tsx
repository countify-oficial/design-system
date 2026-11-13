import { useComponentProps } from "@countify-oficial/provider";
import { resolveSpacing, type Spacing } from "@countify-oficial/tokens";
import type { ElementType } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import type { PolymorphicProps } from "../polymorphic";
import { useThemeStyle } from "../styles";

export interface FlexOwnProps {
  /** flexDirection. Padrão: row (no React Native o padrão seria column). */
  direction?: ViewStyle["flexDirection"];
  /** flexWrap. Padrão: nowrap. */
  wrap?: ViewStyle["flexWrap"];
  /** Espaço entre os itens: xs–xl ou degrau da grade de 4 (3 = 12). Sem ele, nenhum. */
  gap?: Spacing | undefined;
  /** Espaço entre as linhas; sem ele, o gap. */
  rowGap?: Spacing | undefined;
  /** Espaço entre as colunas; sem ele, o gap. */
  columnGap?: Spacing | undefined;
  /** alignItems. */
  align?: ViewStyle["alignItems"];
  /** justifyContent. */
  justify?: ViewStyle["justifyContent"];
  style?: StyleProp<ViewStyle>;
}

export type FlexProps<C extends ElementType = typeof View> = PolymorphicProps<C, FlexOwnProps>;

const px = (s: Spacing | undefined) => (s === undefined ? undefined : resolveSpacing(s));

/** Flexbox com as props pelo nome: direção, quebra, espaço e alinhamento. Linha por padrão, como na web. */
export function Flex<C extends ElementType = typeof View>(props: FlexProps<C>) {
  const { component, direction = "row", wrap, gap, rowGap, columnGap, align, justify, style, ...rest } = useComponentProps("Flex", {}, props);
  const doTema = useThemeStyle("Flex");
  const Component: ElementType = component ?? View;
  return (
    <Component
      {...rest}
      style={[
        { flexDirection: direction, flexWrap: wrap, gap: px(gap), rowGap: px(rowGap), columnGap: px(columnGap), alignItems: align, justifyContent: justify },
        doTema,
        style,
      ]}
    />
  );
}
