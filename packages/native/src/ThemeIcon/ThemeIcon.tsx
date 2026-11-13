import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { avatarSize, radius as cantos, tones, type Size, type Tone } from "@countify-oficial/tokens";
import type { ElementType, ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { ContentColor } from "../contentColor";
import type { PolymorphicProps } from "../polymorphic";
import { useThemeStyle } from "../styles";

export interface ThemeIconOwnProps {
  /** light: fundo claro do tom; filled: fundo cheio. Padrão: light. */
  variant?: "light" | "filled" | undefined;
  /** gray, accent, up, down ou warn. Padrão: accent. */
  color?: Tone | undefined;
  /** Lado: xs 24, sm 32, md 40, lg 48, xl 64. Padrão: md. */
  size?: Size | undefined;
  /** Canto. Padrão: sm (12). */
  radius?: Size | undefined;
  /** Redondo. */
  round?: boolean | undefined;
  /** O ícone; recebe a cor. */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export type ThemeIconProps<C extends ElementType = typeof View> = PolymorphicProps<C, ThemeIconOwnProps>;

/** Ícone num quadrado colorido, como o das linhas de lista. Decorativo. */
export function ThemeIcon<C extends ElementType = typeof View>(props: ThemeIconProps<C>) {
  const { component, variant = "light", color = "accent", size = "md", radius = "sm", round, style, ...rest } = useComponentProps("ThemeIcon", {}, props);
  const { colors: c } = useCountifyTheme();
  const tema = useThemeStyle("ThemeIcon");
  const tom = tones[color];
  const lado = avatarSize[size];
  const Component: ElementType = component ?? View;
  return (
    <ContentColor value={variant === "filled" ? c.bg : c[tom.c]}>
      <Component
        importantForAccessibility="no-hide-descendants"
        {...rest}
        style={[
          { width: lado, height: lado, alignItems: "center", justifyContent: "center", borderRadius: round ? lado / 2 : cantos[radius] },
          { backgroundColor: variant === "filled" ? c[tom.fill] : c[tom.tint] },
          tema,
          style,
        ]}
      />
    </ContentColor>
  );
}
