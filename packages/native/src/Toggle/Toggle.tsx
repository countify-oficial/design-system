import { useControllableState } from "@countify-oficial/hooks";
import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { fontSize, nativeFontFamily, radius as cantos, space, state, borderWidth, type Size } from "@countify-oficial/tokens";
import type { ElementType, ReactNode } from "react";
import { Pressable, Text as RNText, type GestureResponderEvent, type PressableProps } from "react-native";
import { ContentColor } from "../contentColor";
import type { PolymorphicProps } from "../polymorphic";
import { pressableStyle, useThemeStyle } from "../styles";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";

export interface ToggleOwnProps {
  /** Ligado (controlado). */
  pressed?: boolean | undefined;
  /** Ligado no início (não controlado). */
  defaultPressed?: boolean | undefined;
  /** Chamado com o novo estado a cada toque. */
  onPressedChange?: ((pressed: boolean) => void) | undefined;
  /** Canto: xs 8, sm 12, md 16, lg 20, xl 24. Padrão: sm. */
  radius?: Size | undefined;
  disabled?: boolean | undefined;
  onPress?: ((e: GestureResponderEvent) => void) | undefined;
  /** Texto (vira Text com a letra do chip) ou outros elementos. */
  children?: ReactNode;
  style?: PressableProps["style"] | undefined;
}

export type ToggleProps<C extends ElementType = typeof Pressable> = PolymorphicProps<C, ToggleOwnProps>;

/** Botão que liga e desliga, com o visual dos chips de escolha da Countify. */
export function Toggle<C extends ElementType = typeof Pressable>(props: ToggleProps<C>) {
  const { component, pressed, defaultPressed, onPressedChange, radius = "sm", disabled, onPress, children, style, ...rest } =
    useComponentProps("Toggle", {}, props);
  const { colors: c } = useCountifyTheme();
  const tema = useThemeStyle("Toggle");
  const [ligado, setLigado] = useControllableState({ value: pressed, defaultValue: defaultPressed ?? false, onChange: onPressedChange });
  const fg = ligado ? c.accent : c.text2;
  return (
    <ContentColor value={fg}>
      <UnstyledButton
        component={component as ElementType}
        disabled={disabled}
        accessibilityRole="togglebutton"
        accessibilityState={{ checked: ligado }}
        onPress={(e: GestureResponderEvent) => {
          onPress?.(e);
          setLigado(!ligado);
        }}
        {...rest}
        style={pressableStyle(style, ({ pressed: apertado }) => [
          {
            flexDirection: "row", alignItems: "center", justifyContent: "center", gap: space[2], paddingHorizontal: space[3],
            borderRadius: cantos[radius], backgroundColor: c.card, borderWidth: borderWidth.thin, borderColor: c.divider,
          },
          ligado && { backgroundColor: c.accentTint, borderWidth: borderWidth.thick, borderColor: c.accent },
          apertado && { opacity: state.pressedOpacity },
          disabled && { opacity: state.disabledOpacity },
          tema,
        ])}
      >
        {typeof children === "string" ? (
          <RNText style={{ color: fg, fontSize: fontSize.sm, fontFamily: nativeFontFamily[500] }}>{children}</RNText>
        ) : (
          children
        )}
      </UnstyledButton>
    </ContentColor>
  );
}
