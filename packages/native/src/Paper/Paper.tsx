import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { borderWidth, nativeRaisedShadow, radius as cantos, shadows, type Size } from "@countify-oficial/tokens";
import type { ElementType } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import type { PolymorphicProps } from "../polymorphic";
import { useThemeStyle } from "../styles";

export interface PaperOwnProps {
  /** Elevação: xs, sm e md são o anel (aqui, borda fina); lg e xl, a sombra da identidade. Sem ela, nenhuma. */
  shadow?: Size | undefined;
  /** Canto: xs 8, sm 12, md 16, lg 20, xl 24. Padrão: md. */
  radius?: Size | undefined;
  /** O anel fino na cor da divisória. */
  withBorder?: boolean | undefined;
  style?: StyleProp<ViewStyle>;
}

export type PaperProps<C extends ElementType = typeof View> = PolymorphicProps<C, PaperOwnProps>;

/** Superfície: fundo de cartão, canto e elevação da identidade. */
export function Paper<C extends ElementType = typeof View>(props: PaperProps<C>) {
  const { component, shadow, radius = "md", withBorder, style, ...rest } = useComponentProps("Paper", {}, props);
  const { colors: c, colorScheme } = useCountifyTheme();
  const tema = useThemeStyle("Paper");
  const Component: ElementType = component ?? View;
  // o React Native não tem sombra por dentro: o anel vira borda fina
  const anel = withBorder || shadow !== undefined;
  return (
    <Component
      {...rest}
      style={[
        { backgroundColor: c.card, borderRadius: cantos[radius] },
        anel && { borderWidth: borderWidth.thin, borderColor: c.divider },
        shadow !== undefined && shadows[shadow] === "raised" && nativeRaisedShadow(colorScheme),
        tema,
        style,
      ]}
    />
  );
}
