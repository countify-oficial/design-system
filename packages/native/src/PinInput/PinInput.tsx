import { useControllableState } from "@countify-oficial/hooks";
import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { controlHeight, focusRing, fontSize, nativeMonoFontFamily, radius, space, state, borderWidth, type Size } from "@countify-oficial/tokens";
import { useRef, useState, type ComponentRef } from "react";
import { TextInput as RNTextInput, View, type StyleProp, type ViewStyle } from "react-native";

export interface PinInputProps {
  length?: number | undefined;
  type?: "number" | "alphanumeric" | undefined;
  mask?: boolean | undefined;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  onComplete?: ((value: string) => void) | undefined;
  /** Nome para o leitor de tela; cada caixa vira "nome, 1 de 4". Padrão: "Código". */
  label?: string | undefined;
  size?: Size | undefined;
  variant?: "filled" | "outline" | undefined;
  error?: boolean | undefined;
  disabled?: boolean | undefined;
  autoFocus?: boolean | undefined;
  style?: StyleProp<ViewStyle>;
}

/** Código em caixas: avança sozinho, volta ao apagar e aceita colar (o SMS preenche no iOS). */
export function PinInput(props: PinInputProps) {
  const {
    length = 4, type = "number", mask, value, defaultValue, onChange, onComplete, label = "Código", size = "md", variant = "filled", error, disabled, autoFocus, style,
  } = useComponentProps("PinInput", {}, props);
  const { colors: c } = useCountifyTheme();
  const [codigo, setCodigo] = useControllableState({ value, defaultValue: defaultValue ?? "", onChange });
  const [foco, setFoco] = useState(-1);
  const campos = useRef<(ComponentRef<typeof RNTextInput> | null)[]>([]);
  const aceita = type === "number" ? /^\d$/ : /^[\p{L}\d]$/u;
  const focar = (i: number) => campos.current[Math.max(0, Math.min(length - 1, i))]?.focus();
  const gravar = (v: string) => {
    const novo = v.slice(0, length);
    setCodigo(novo);
    if (novo.length === length && !novo.includes(" ")) onComplete?.(novo);
  };
  const escrever = (i: number, texto: string) => {
    const letras = Array.from(texto).filter((ch) => aceita.test(ch));
    if (letras.length === 0) return;
    const atual = Array.from({ length }, (_, k) => codigo[k] ?? " ");
    letras.forEach((ch, k) => {
      if (i + k < length) atual[i + k] = ch;
    });
    gravar(atual.join("").trimEnd());
    focar(i + letras.length);
  };
  const lado = controlHeight.input[size];
  return (
    <View accessibilityRole="none" accessibilityLabel={label} style={[{ flexDirection: "row", gap: space[2] }, style]}>
      {Array.from({ length }, (_, i) => {
        const borda = foco === i || error ? focusRing.width : variant === "outline" ? borderWidth.thin : 0;
        return (
          <RNTextInput
            key={i}
            ref={(el) => {
              campos.current[i] = el;
            }}
            accessibilityLabel={`${label}, ${i + 1} de ${length}`}
            keyboardType={type === "number" ? "number-pad" : "default"}
            autoCapitalize="characters"
            textContentType={i === 0 ? "oneTimeCode" : "none"}
            autoComplete={i === 0 ? "sms-otp" : "off"}
            secureTextEntry={mask}
            editable={!disabled}
            autoFocus={autoFocus && i === 0}
            // a caixa cheia fica selecionada: digitar troca o algarismo em vez de virar "colar" de dois
            selectTextOnFocus
            value={(codigo[i] ?? "").trim()}
            onChangeText={(t) => escrever(i, t.length > 1 ? t : t.slice(-1))}
            onKeyPress={(e) => {
              if (e.nativeEvent.key !== "Backspace") return;
              const atual = Array.from({ length }, (_, k) => codigo[k] ?? " ");
              const alvo = atual[i]?.trim() ? i : i - 1;
              if (alvo < 0) return;
              atual[alvo] = " ";
              gravar(atual.join("").trimEnd());
              focar(alvo);
            }}
            onFocus={() => setFoco(i)}
            onBlur={() => setFoco(-1)}
            style={[
              {
                width: lado, height: lado, padding: 0, borderRadius: radius.sm, backgroundColor: c.field, textAlign: "center", color: c.text,
                fontSize: fontSize.xl, fontFamily: nativeFontFamily700Mono(), borderWidth: borda,
                borderColor: foco === i ? c.accent : error ? c.down : variant === "outline" ? c.controlBorder : "transparent",
              },
              disabled && { opacity: state.disabledOpacity },
            ]}
          />
        );
      })}
    </View>
  );
}

// a Roboto Mono do pacote vai até 500
const nativeFontFamily700Mono = () => nativeMonoFontFamily[500];
