import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { borderWidth, resolveSpacing, type Size, type Spacing } from "@countify-oficial/tokens";
import { Children, createContext, useContext, type ElementType } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { Paper } from "../Paper/Paper";
import type { PolymorphicProps } from "../polymorphic";
import { useThemeStyle } from "../styles";

export interface CardOwnProps {
  /** Recuo: xs–xl ou degrau da grade de 4. Padrão: md (16). */
  padding?: Spacing | undefined;
  /** Espaço entre os filhos. Padrão: md (16). */
  gap?: Spacing | undefined;
  /** Elevação. Padrão: xs (o anel). */
  shadow?: Size | undefined;
  /** Canto. Padrão: md (16). */
  radius?: Size | undefined;
  style?: StyleProp<ViewStyle>;
}

export type CardProps<C extends ElementType = typeof View> = PolymorphicProps<C, CardOwnProps>;

export interface CardSectionOwnProps {
  /** Linha da divisória entre a seção e o resto. */
  withBorder?: boolean | undefined;
  style?: StyleProp<ViewStyle>;
}

export type CardSectionProps<C extends ElementType = typeof View> = PolymorphicProps<C, CardSectionOwnProps>;

// o React Native não tem :first-child: o Card diz a cada filho o recuo e se ele é o primeiro ou o último
const Posicao = createContext({ recuo: 0, primeira: false, ultima: false });

/** Parte do cartão que encosta nas bordas (uma imagem, uma lista). */
export function CardSection<C extends ElementType = typeof View>(props: CardSectionProps<C>) {
  const { component, withBorder, style, ...rest } = useComponentProps("CardSection", {}, props);
  const { recuo, primeira, ultima } = useContext(Posicao);
  const { colors: c } = useCountifyTheme();
  const tema = useThemeStyle("CardSection");
  const Component: ElementType = component ?? View;
  return (
    <Component
      {...rest}
      style={[
        { marginHorizontal: -recuo },
        primeira && { marginTop: -recuo },
        ultima && { marginBottom: -recuo },
        withBorder && !primeira && { borderTopWidth: borderWidth.thin, borderColor: c.divider },
        withBorder && !ultima && { borderBottomWidth: borderWidth.thin, borderColor: c.divider },
        tema,
        style,
      ]}
    />
  );
}

function CardRoot<C extends ElementType = typeof View>(props: CardProps<C>) {
  const { component, padding = "md", gap = "md", shadow = "xs", radius = "md", style, children, ...rest } = useComponentProps("Card", {}, props);
  const tema = useThemeStyle("Card");
  const recuo = resolveSpacing(padding);
  const filhos = Children.toArray(children);
  return (
    <Paper component={component as ElementType} shadow={shadow} radius={radius} {...rest} style={[{ padding: recuo, gap: resolveSpacing(gap) }, tema, style]}>
      {filhos.map((filho, i) => (
        <Posicao key={i} value={{ recuo, primeira: i === 0, ultima: i === filhos.length - 1 }}>{filho}</Posicao>
      ))}
    </Paper>
  );
}

/** Cartão da Countify: recuo de 16, canto de 16 e o anel. Card.Section encosta nas bordas. */
export const Card = Object.assign(CardRoot, { Section: CardSection });
