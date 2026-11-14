import { hasContent, useCountifyTheme, useMessages } from "@countify-oficial/provider";
import { controlFontSize, controlHeight, fontSize, lineHeightPx, nativeFontFamily, radius, space, state, borderWidth, focusRing, type Size } from "@countify-oficial/tokens";
import type { ReactNode } from "react";
import { Text as RNText, View, type GestureResponderEvent, type StyleProp, type ViewStyle } from "react-native";
import { ContentColor } from "../contentColor";
import { Icon } from "../Icon/Icon";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";

export interface ChoiceFieldProps {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  required?: boolean | undefined;
  placeholder?: string | undefined;
  variant?: "filled" | "outline" | undefined;
  size?: Size | undefined;
  disabled?: boolean | undefined;
  style?: StyleProp<ViewStyle>;
}

/** Campo que abre a folha de opções: rótulo, a caixa com o valor (ou etiquetas) e a seta. */
export function ChoiceField({
  label, description, error, required, placeholder, variant = "filled", size = "md", disabled, style, valor, conteudo, aberto, onPress,
}: ChoiceFieldProps & { valor?: string | undefined; conteudo?: ReactNode; aberto: boolean; onPress?: (e: GestureResponderEvent) => void }) {
  const { colors: c } = useCountifyTheme();
  const messages = useMessages();
  const letra = { fontSize: fontSize.sm, lineHeight: lineHeightPx(fontSize.sm), fontFamily: nativeFontFamily[400] };
  const borda = error ? focusRing.width : variant === "outline" ? borderWidth.thin : 0;
  return (
    <View style={[{ gap: space[2] }, style]}>
      {hasContent(label) && (
        <RNText style={[letra, { color: c.text2 }]}>
          {label}
          {required && <RNText accessibilityLabel={messages.required} style={{ color: c.down }}> *</RNText>}
        </RNText>
      )}
      <ContentColor value={c.text2}>
        <UnstyledButton
          accessibilityRole="combobox"
          accessibilityLabel={typeof label === "string" ? label : undefined}
          accessibilityValue={valor ? { text: valor } : undefined}
          accessibilityState={{ expanded: aberto, disabled: !!disabled }}
          disabled={disabled}
          onPress={onPress}
          style={({ pressed }) => [
            {
              flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: space[1], minHeight: controlHeight.input[size], paddingHorizontal: space[4] - borda,
              paddingVertical: space[1], borderRadius: radius.sm, backgroundColor: c.field, borderWidth: borda, borderColor: error ? c.down : c.controlBorder,
            },
            pressed && { opacity: state.pressedOpacity },
            disabled && { opacity: state.disabledOpacity },
          ]}
        >
          <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: space[1] }}>
            {conteudo ?? (
              <RNText numberOfLines={1} style={{ color: valor ? c.text : c.text3, fontSize: controlFontSize[size], fontFamily: nativeFontFamily[400] }}>{valor ?? placeholder ?? ""}</RNText>
            )}
          </View>
          <Icon name="chevron-down" />
        </UnstyledButton>
      </ContentColor>
      {hasContent(description) && <RNText style={[letra, { color: c.text2 }]}>{description}</RNText>}
      {hasContent(error) && <RNText accessibilityRole="alert" accessibilityLiveRegion="polite" style={[letra, { color: c.down }]}>{error}</RNText>}
    </View>
  );
}
