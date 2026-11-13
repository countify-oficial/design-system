import { useComponentProps } from "@countify-oficial/provider";
import { resolveSpacing, type Responsive, type Spacing } from "@countify-oficial/tokens";
import { createContext, useContext, type ElementType } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import type { PolymorphicProps } from "../polymorphic";
import { useResponsive, useThemeStyle } from "../styles";

export interface GridOwnProps {
  /** Quantas colunas a grade tem. Padrão: 12, como nas telas da Countify. */
  columns?: number | undefined;
  /** Espaço entre colunas e linhas: xs–xl ou degrau da grade de 4 (3 = 12). Padrão: lg (24, como nas telas). */
  gap?: Spacing | undefined;
  style?: StyleProp<ViewStyle>;
}

export type GridProps<C extends ElementType = typeof View> = PolymorphicProps<C, GridOwnProps>;

export interface GridColOwnProps {
  /** Quantas colunas ocupa; por ponto de quebra (largura da tela): { base: 12, sm: 6 }. Padrão: a linha toda. */
  span?: Responsive<number> | undefined;
  style?: StyleProp<ViewStyle>;
}

export type GridColProps<C extends ElementType = typeof View> = PolymorphicProps<C, GridColOwnProps>;

const GridContext = createContext({ columns: 12, gap: 0 });

/** Uma coluna do Grid. */
export function GridCol<C extends ElementType = typeof View>(props: GridColProps<C>) {
  const { component, span, style, ...rest } = useComponentProps("GridCol", {}, props);
  const { columns, gap } = useContext(GridContext);
  const doTema = useThemeStyle("GridCol");
  const largura = useResponsive(span ?? columns);
  const Component: ElementType = component ?? View;
  return <Component {...rest} style={[{ width: `${(largura / columns) * 100}%`, paddingHorizontal: gap / 2 }, doTema, style]} />;
}

function GridRoot<C extends ElementType = typeof View>(props: GridProps<C>) {
  const { component, columns = 12, gap = "lg", style, children, ...rest } = useComponentProps("Grid", {}, props);
  const doTema = useThemeStyle("Grid");
  const g = resolveSpacing(gap);
  const Component: ElementType = component ?? View;
  return (
    <GridContext value={{ columns, gap: g }}>
      <Component {...rest} style={[{ flexDirection: "row", flexWrap: "wrap", marginHorizontal: -g / 2, rowGap: g }, doTema, style]}>
        {children}
      </Component>
    </GridContext>
  );
}

/** Grade de colunas (12 por padrão). As colunas são Grid.Col, com span por ponto de quebra. */
export const Grid = Object.assign(GridRoot, { Col: GridCol });
