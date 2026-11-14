import { useId } from "@countify-oficial/hooks";
import { useComponentProps, useCountifyTheme, useMessages } from "@countify-oficial/provider";
import {
  controlFontSize, controlHeight, focusRing, fontSize, lineHeightPx, nativeFontFamily, radius as cantos, space, state, borderWidth, type Size,
} from "@countify-oficial/tokens";
import { useState, type ComponentRef, type ReactNode, type Ref } from "react";
import { Text as RNText, TextInput as RNTextInput, View, type StyleProp, type TextInputProps as RNTextInputProps, type TextStyle, type ViewStyle } from "react-native";
import { ContentColor } from "../contentColor";
import { useThemeStyle } from "../styles";

export interface InputBaseProps extends Omit<RNTextInputProps, "style" | "editable"> {
  /** Rótulo, sempre visível (identidade); vira o nome do campo para o leitor de tela. */
  label?: ReactNode;
  /** Texto de ajuda, embaixo do campo. */
  description?: ReactNode;
  /** Mensagem de erro, embaixo do campo, anunciada. true só marca o campo. */
  error?: ReactNode;
  required?: boolean | undefined;
  withAsterisk?: boolean | undefined;
  /** filled: fundo de campo, sem contorno (mockup); outline: com a borda (para campo sobre cartão). Padrão: filled. */
  variant?: "filled" | "outline" | undefined;
  /** Altura e letra: xs/sm 44, md 48, lg 52, xl 56. Padrão: md. */
  size?: Size | undefined;
  /** Canto. Padrão: sm (12). */
  radius?: Size | undefined;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  disabled?: boolean | undefined;
  /** Linhas (vira campo de várias linhas). */
  rows?: number | undefined;
  id?: string | undefined;
  /** Estilo da View de fora. */
  style?: StyleProp<ViewStyle>;
  /** Estilo do campo (TextInput). */
  inputStyle?: StyleProp<TextStyle>;
  ref?: Ref<ComponentRef<typeof RNTextInput>> | undefined;
}

const temTexto = (v: ReactNode) => v !== undefined && v !== null && v !== false && v !== true && v !== "";

/** Campo completo: rótulo, caixa, descrição e erro. A base dos outros campos. */
export function InputBase(props: InputBaseProps) {
  const messages = useMessages();
  const {
    label, description, error, required, withAsterisk, variant = "filled", size = "md", radius = "sm", leftSection, rightSection, disabled,
    rows, id, style, inputStyle, onFocus, onBlur, accessibilityLabel, ...rest
  } = useComponentProps("InputBase", {}, props);
  const { colors: c } = useCountifyTheme();
  const tema = useThemeStyle("Input");
  const base = useId(id);
  const [focado, setFocado] = useState(false);
  // a borda cresce no foco e no erro; o recuo diminui o mesmo tanto e o texto não pula
  const borda = focado || error ? focusRing.width : variant === "outline" ? borderWidth.thin : 0;
  const corBorda = focado ? c.accent : error ? c.down : variant === "outline" ? c.controlBorder : "transparent";
  const letra = { fontSize: fontSize.sm, lineHeight: lineHeightPx(fontSize.sm), fontFamily: nativeFontFamily[400] };
  const multilinha = rows !== undefined;
  return (
    <View style={[{ gap: space[2] }, style]}>
      {temTexto(label) && (
        <RNText nativeID={`${base}-label`} style={[letra, { color: c.text2 }]}>
          {label}
          {(withAsterisk ?? required) && <RNText accessibilityLabel={messages.required} style={{ color: c.down }}> *</RNText>}
        </RNText>
      )}
      <ContentColor value={c.text2}>
        <View
          style={[
            {
              flexDirection: "row", alignItems: multilinha ? "flex-start" : "center", gap: space[3], minHeight: controlHeight.input[size],
              paddingHorizontal: space[4] - borda, borderRadius: cantos[radius], backgroundColor: c.field, borderWidth: borda, borderColor: corBorda,
            },
            disabled && { opacity: state.disabledOpacity },
            tema,
          ]}
        >
          {leftSection}
          <RNTextInput
            accessibilityLabel={accessibilityLabel ?? (typeof label === "string" ? label : undefined)}
            accessibilityLabelledBy={temTexto(label) ? `${base}-label` : undefined}
            accessibilityHint={typeof description === "string" ? description : undefined}
            accessibilityState={{ disabled: !!disabled }}
            placeholderTextColor={c.text3}
            editable={!disabled}
            multiline={multilinha}
            numberOfLines={rows}
            textAlignVertical={multilinha ? "top" : "center"}
            onFocus={(e) => {
              setFocado(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocado(false);
              onBlur?.(e);
            }}
            {...rest}
            style={[
              { flex: 1, alignSelf: "stretch", color: c.text, fontSize: controlFontSize[size], fontFamily: nativeFontFamily[400], padding: 0 },
              multilinha && { minHeight: rows * lineHeightPx(controlFontSize[size]) + 2 * space[3], paddingVertical: space[3] },
              inputStyle,
            ]}
          />
          {rightSection !== undefined && <View style={{ marginRight: -space[3] }}>{rightSection}</View>}
        </View>
      </ContentColor>
      {temTexto(description) && <RNText style={[letra, { color: c.text2 }]}>{description}</RNText>}
      {temTexto(error) && (
        <RNText accessibilityRole="alert" accessibilityLiveRegion="polite" style={[letra, { color: c.down }]}>{error}</RNText>
      )}
    </View>
  );
}
