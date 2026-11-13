import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { borderWidth, fontSize, nativeFontFamily, radius, space, tones, type Tone } from "@countify-oficial/tokens";
import type { ElementType, ReactNode } from "react";
import { Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";
import { ContentColor } from "../contentColor";
import type { PolymorphicProps } from "../polymorphic";
import { useThemeStyle } from "../styles";

/** light: etiqueta ("parcial"); filled: contador; outline: só o contorno; dot: bolinha com texto ("Online"). */
export type BadgeVariant = "light" | "filled" | "outline" | "dot";

export interface BadgeOwnProps {
  /** Padrão: light. */
  variant?: BadgeVariant | undefined;
  /** gray, accent, up, down ou warn. Padrão: gray. */
  color?: Tone | undefined;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  /** Texto (vira Text na letra do badge) ou outros elementos. */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export type BadgeProps<C extends ElementType = typeof View> = PolymorphicProps<C, BadgeOwnProps>;

/** Etiqueta curta: situação, contagem ou marca ("parcial"). Cor sempre com texto. */
export function Badge<C extends ElementType = typeof View>(props: BadgeProps<C>) {
  const { component, variant = "light", color = "gray", leftSection, rightSection, children, style, ...rest } = useComponentProps("Badge", {}, props);
  const { colors: c } = useCountifyTheme();
  const tema = useThemeStyle("Badge");
  const tom = tones[color];
  const fg = variant === "filled" ? c.bg : variant === "light" && color === "gray" ? c.label : c[tom.c];
  const Component: ElementType = component ?? View;
  const ponto = variant === "dot";
  return (
    <ContentColor value={fg}>
      <Component
        {...rest}
        style={[
          { flexDirection: "row", alignItems: "center", justifyContent: "center", alignSelf: "flex-start", gap: space[1] },
          !ponto && { minWidth: space[6], height: space[6], paddingHorizontal: space[2], borderRadius: radius.xs },
          variant === "light" && { backgroundColor: c[tom.tint] },
          variant === "filled" && { backgroundColor: c[tom.fill], borderRadius: radius.sm },
          variant === "outline" && { borderWidth: borderWidth.thin, borderColor: c[tom.c] },
          ponto && { gap: space[2] },
          tema,
          style,
        ]}
      >
        {ponto && <View style={{ width: space[2], height: space[2], borderRadius: space[1], backgroundColor: fg }} />}
        {leftSection}
        {typeof children === "string" || typeof children === "number" ? (
          <RNText
            style={{
              color: fg,
              fontSize: ponto ? fontSize.sm : fontSize.xs,
              fontFamily: nativeFontFamily[variant === "filled" ? 700 : ponto ? 400 : 500],
            }}
          >
            {children}
          </RNText>
        ) : (
          children
        )}
        {rightSection}
      </Component>
    </ContentColor>
  );
}
