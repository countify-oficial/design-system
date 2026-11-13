import { useComponentProps, useComponentTheme } from "@countify-oficial/provider";
import { touchTarget } from "@countify-oficial/tokens";
import type { ElementType } from "react";
import { Pressable, StyleSheet, type PressableProps, type PressableStateCallbackType, type StyleProp, type ViewStyle } from "react-native";
import type { PolymorphicProps } from "../polymorphic";

export interface UnstyledButtonOwnProps {
  /** Desliga o botão: não responde ao toque e o leitor de tela anuncia "desativado". */
  disabled?: boolean | undefined;
  /** Estilo, ou função do estado ({ pressed }) que devolve o estilo. */
  style?: PressableProps["style"] | undefined;
}

export type UnstyledButtonProps<C extends ElementType = typeof Pressable> = PolymorphicProps<C, UnstyledButtonOwnProps>;

const s = StyleSheet.create({ alvo: { minWidth: touchTarget, minHeight: touchTarget } });

/** Botão sem aparência (Pressable), com papel de botão e alvo de toque mínimo de 44. Base dos outros botões. */
export function UnstyledButton<C extends ElementType = typeof Pressable>(props: UnstyledButtonProps<C>) {
  const { component, disabled, style, ...rest } = useComponentProps("UnstyledButton", {}, props);
  const doTema = useComponentTheme("UnstyledButton").styles?.["root"] as StyleProp<ViewStyle>;
  const Component: ElementType = component ?? Pressable;
  const base = [s.alvo, doTema];
  return (
    <Component
      accessibilityRole="button"
      {...rest}
      // o Pressable junta disabled ao accessibilityState
      disabled={disabled}
      style={typeof style === "function" ? (estado: PressableStateCallbackType) => [base, style(estado)] : [base, style]}
    />
  );
}
