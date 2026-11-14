import { CountifyContext, useComponentProps, useCountifyTheme, type CountifyContextValue } from "@countify-oficial/provider";
import { colors, controlHeight, fontSize, nativeFontFamily, nativeRaisedShadow, radius, space } from "@countify-oficial/tokens";
import type { ReactNode } from "react";
import { Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";
import { CloseButton } from "../CloseButton/CloseButton";
import { ContentColor } from "../contentColor";
import { Loader } from "../Loader/Loader";
import { useThemeStyle } from "../styles";

export interface NotificationProps {
  title?: ReactNode;
  /** default: cores invertidas; down: vermelho, para erro. Padrão: default. */
  color?: "default" | "down" | undefined;
  icon?: ReactNode;
  /** Girador no lugar do ícone. */
  loading?: boolean | undefined;
  /** Ação curta ("Desfazer"). Usa as cores do outro modo, para ler sobre o fundo invertido. */
  action?: ReactNode;
  withCloseButton?: boolean | undefined;
  onClose?: (() => void) | undefined;
  closeButtonLabel?: string | undefined;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string | undefined;
}

/** Aviso curto que flutua sobre a tela ("Análise salva"). O gerenciador da fila fica em @countify-oficial/notifications. */
export function Notification(props: NotificationProps) {
  const { title, color = "default", icon, loading, action, withCloseButton, onClose, closeButtonLabel, children, style, testID } =
    useComponentProps("Notification", {}, props);
  const tudo = useCountifyTheme();
  const { colors: c, colorScheme } = tudo;
  // o fundo é invertido (o texto do modo): ação e fechar usam as cores do outro modo; no vermelho, o azul do outro
  // modo não chega a 4,5:1 e a ação usa o texto dele
  const inverso = colorScheme === "dark" ? "light" : "dark";
  const outro: CountifyContextValue = { ...tudo, colorScheme: inverso, colors: color === "down" ? { ...colors[inverso], accent: colors[inverso].text } : colors[inverso] };
  const tema = useThemeStyle("Notification");
  const fg = c.bg;
  const letra = (peso: 500 | 700) => ({ color: fg, fontSize: fontSize.sm, fontFamily: nativeFontFamily[peso] });
  return (
    <ContentColor value={fg}>
      <View
        testID={testID}
        accessibilityRole={color === "down" ? "alert" : "summary"}
        accessibilityLiveRegion={color === "down" ? "assertive" : "polite"}
        style={[
          { flexDirection: "row", alignItems: "center", gap: space[3], minHeight: controlHeight.input.md, paddingVertical: space[2], paddingHorizontal: space[4], borderRadius: radius.sm, backgroundColor: color === "down" ? c.down : c.text },
          nativeRaisedShadow(colorScheme),
          tema,
          style,
        ]}
      >
        {loading ? <Loader size="sm" label={false} /> : icon}
        <View style={{ flex: 1 }}>
          {title !== undefined && (typeof title === "string" ? <RNText style={letra(700)}>{title}</RNText> : title)}
          {typeof children === "string" ? <RNText style={letra(500)}>{children}</RNText> : children}
        </View>
        <CountifyContext value={outro}>
          {action}
          {withCloseButton && <CloseButton accessibilityLabel={closeButtonLabel} onPress={onClose} color="text" style={{ marginRight: -space[3] }} />}
        </CountifyContext>
      </View>
    </ContentColor>
  );
}
