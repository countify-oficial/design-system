import { hasContent, useComponentProps, useCountifyTheme, useMessages } from "@countify-oficial/provider";
import { controlFontSize, controlHeight, focusRing, fontSize, lineHeightPx, nativeFontFamily, radius, space, state, borderWidth, touchTarget, type Size } from "@countify-oficial/tokens";
import { createContext, useContext, useState, type ReactNode } from "react";
import { Text as RNText, TextInput as RNTextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from "react-native";

export interface PillsInputProps {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  required?: boolean | undefined;
  variant?: "filled" | "outline" | undefined;
  size?: Size | undefined;
  disabled?: boolean | undefined;
  rightSection?: ReactNode;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const Campo = createContext<{ rotulo: string | undefined; setFocado: (v: boolean) => void; desligado: boolean }>({ rotulo: undefined, setFocado: () => undefined, desligado: false });

/** O campo de texto dentro do PillsInput. */
export function PillsInputField(props: TextInputProps) {
  const { rotulo, setFocado, desligado } = useContext(Campo);
  const { colors: c } = useCountifyTheme();
  const { onFocus, onBlur, style, ...rest } = props;
  return (
    <RNTextInput
      accessibilityLabel={rotulo}
      editable={!desligado}
      placeholderTextColor={c.text3}
      onFocus={(e) => {
        setFocado(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocado(false);
        onBlur?.(e);
      }}
      {...rest}
      style={[{ flex: 1, minWidth: space[8] * 3, minHeight: touchTarget, padding: 0, color: c.text, fontSize: controlFontSize.md, fontFamily: nativeFontFamily[400] }, style]}
    />
  );
}

/** Caixa de campo que junta etiquetas e um campo de texto. */
function PillsInputRoot(props: PillsInputProps) {
  const messages = useMessages();
  const { label, description, error, required, variant = "filled", size = "md", disabled, rightSection, children, style } = useComponentProps("PillsInput", {}, props);
  const { colors: c } = useCountifyTheme();
  const [focado, setFocado] = useState(false);
  const borda = focado || error ? focusRing.width : variant === "outline" ? borderWidth.thin : 0;
  const letra = { fontSize: fontSize.sm, lineHeight: lineHeightPx(fontSize.sm), fontFamily: nativeFontFamily[400] };
  return (
    <View style={[{ gap: space[2] }, style]}>
      {hasContent(label) && <RNText style={[letra, { color: c.text2 }]}>{label}{required && <RNText accessibilityLabel={messages.required} style={{ color: c.down }}> *</RNText>}</RNText>}
      <Campo value={{ rotulo: typeof label === "string" ? label : undefined, setFocado, desligado: !!disabled }}>
        <View
          style={[
            {
              flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: space[1], minHeight: controlHeight.input[size], paddingVertical: space[1], paddingHorizontal: space[4] - borda,
              borderRadius: radius.sm, backgroundColor: c.field, borderWidth: borda, borderColor: focado ? c.accent : error ? c.down : c.controlBorder,
            },
            disabled && { opacity: state.disabledOpacity },
          ]}
        >
          {children}
          {rightSection !== undefined && <View style={{ marginLeft: "auto", marginRight: -space[3] }}>{rightSection}</View>}
        </View>
      </Campo>
      {hasContent(description) && <RNText style={[letra, { color: c.text2 }]}>{description}</RNText>}
      {hasContent(error) && <RNText accessibilityRole="alert" accessibilityLiveRegion="polite" style={[letra, { color: c.down }]}>{error}</RNText>}
    </View>
  );
}

/** PillsInput e PillsInput.Field. */
export const PillsInput = Object.assign(PillsInputRoot, { Field: PillsInputField });
