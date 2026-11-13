import { useComponentProps } from "@countify-oficial/provider";
import { resolveSpacing, type Responsive, type Spacing } from "@countify-oficial/tokens";
import { Children, type ElementType } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import type { PolymorphicProps } from "../polymorphic";
import { useResponsive, useThemeStyle } from "../styles";

export interface SimpleGridOwnProps {
  /** Colunas de mesma largura; por ponto de quebra (largura da tela): { base: 1, sm: 2 }. Padrão: 1. */
  cols?: Responsive<number> | undefined;
  /** Espaço entre as colunas: xs–xl ou degrau da grade de 4 (3 = 12). Padrão: md. */
  spacing?: Spacing | undefined;
  /** Espaço entre as linhas; sem ele, o spacing. */
  verticalSpacing?: Spacing | undefined;
  style?: StyleProp<ViewStyle>;
}

export type SimpleGridProps<C extends ElementType = typeof View> = PolymorphicProps<C, SimpleGridOwnProps>;

/**
 * Grade de colunas iguais; cada filho vai numa célula. As células têm meio spacing de recuo de cada lado e a grade
 * compensa com margem negativa (o React Native não tem grid).
 */
export function SimpleGrid<C extends ElementType = typeof View>(props: SimpleGridProps<C>) {
  const { component, cols = 1, spacing = "md", verticalSpacing, style, children, ...rest } = useComponentProps("SimpleGrid", {}, props);
  const doTema = useThemeStyle("SimpleGrid");
  const colunas = useResponsive(cols);
  const x = resolveSpacing(spacing);
  const Component: ElementType = component ?? View;
  return (
    <Component
      {...rest}
      style={[{ flexDirection: "row", flexWrap: "wrap", marginHorizontal: -x / 2, rowGap: resolveSpacing(verticalSpacing ?? spacing) }, doTema, style]}
    >
      {Children.map(children, (filho) => <View style={{ width: `${100 / colunas}%`, paddingHorizontal: x / 2 }}>{filho}</View>)}
    </Component>
  );
}
