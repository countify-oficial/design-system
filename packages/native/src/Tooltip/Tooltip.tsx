import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { fontSize, gutter, nativeFontFamily, radius, space } from "@countify-oficial/tokens";
import { cloneElement, useState, type ReactElement } from "react";
import { Modal as RNModal, StyleSheet, Text as RNText, View, type GestureResponderEvent } from "react-native";

export interface TooltipProps {
  /** O texto. */
  label: string;
  /** Um só filho com onLongPress (Button, ActionIcon, Pressable). */
  children: ReactElement<{ onLongPress?: ((e: GestureResponderEvent) => void) | undefined; onPressOut?: ((e: GestureResponderEvent) => void) | undefined; accessibilityHint?: string | undefined }>;
  disabled?: boolean | undefined;
}

/** No celular, a dica aparece enquanto o dedo segura o alvo (toque longo) e vira a dica do leitor de tela. */
export function Tooltip(props: TooltipProps) {
  const { label, children, disabled } = useComponentProps("Tooltip", {}, props);
  const { colors: c } = useCountifyTheme();
  const [visivel, setVisivel] = useState(false);
  return (
    <>
      {cloneElement(children, {
        accessibilityHint: children.props.accessibilityHint ?? label,
        onLongPress: (e: GestureResponderEvent) => {
          children.props.onLongPress?.(e);
          if (!disabled) setVisivel(true);
        },
        onPressOut: (e: GestureResponderEvent) => {
          children.props.onPressOut?.(e);
          setVisivel(false);
        },
      })}
      <RNModal visible={visivel} transparent animationType="fade" onRequestClose={() => setVisivel(false)}>
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, { justifyContent: "flex-end", alignItems: "center", padding: gutter.mobile, paddingBottom: space[8] * 3 }]}>
          <View accessibilityRole="text" style={{ paddingVertical: space[1], paddingHorizontal: space[2], borderRadius: radius.xs, backgroundColor: c.text }}>
            <RNText style={{ color: c.bg, fontSize: fontSize.xs, fontFamily: nativeFontFamily[500] }}>{label}</RNText>
          </View>
        </View>
      </RNModal>
    </>
  );
}
