import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { borderWidth, fontSize, lineHeightPx, nativeFontFamily, radius, space, tones, type IconName, type Tone } from "@countify-oficial/tokens";
import type { ReactNode } from "react";
import { Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";
import { CloseButton } from "../CloseButton/CloseButton";
import { ContentColor } from "../contentColor";
import { Icon } from "../Icon/Icon";
import { useThemeStyle } from "../styles";

export interface AlertProps {
  title?: ReactNode;
  /** Tom do ícone: accent (informação), down (erro), warn, up ou gray (sem conexão). Padrão: accent. */
  color?: Tone | undefined;
  /** Ícone próprio. Padrão: o do tom; null tira. */
  icon?: ReactNode;
  withCloseButton?: boolean | undefined;
  onClose?: (() => void) | undefined;
  closeButtonLabel?: string | undefined;
  /** O texto; ações também vão aqui. */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string | undefined;
}

const iconePadrao: Record<Tone, IconName> = { accent: "info", down: "alert", warn: "alert", up: "check", gray: "wifi" };

/** Aviso num cartão: erro, informação ou situação. Erro e alerta são anunciados na hora. */
export function Alert(props: AlertProps) {
  const { title, color = "accent", icon, withCloseButton, onClose, closeButtonLabel, children, style, testID } = useComponentProps("Alert", {}, props);
  const { colors: c } = useCountifyTheme();
  const tema = useThemeStyle("Alert");
  const urgente = color === "down" || color === "warn";
  const texto = (conteudo: ReactNode, s: object) => (typeof conteudo === "string" ? <RNText style={s}>{conteudo}</RNText> : conteudo);
  return (
    <View
      testID={testID}
      accessibilityRole={urgente ? "alert" : "summary"}
      accessibilityLiveRegion={urgente ? "assertive" : "polite"}
      style={[
        { flexDirection: "row", alignItems: "flex-start", gap: space[3], padding: space[4], borderRadius: radius.md, backgroundColor: c.card, borderWidth: borderWidth.thin, borderColor: c.divider },
        tema,
        style,
      ]}
    >
      {icon !== null && <ContentColor value={c[tones[color].c]}>{icon ?? <Icon name={iconePadrao[color]} />}</ContentColor>}
      <View style={{ flex: 1, gap: space[1] }}>
        {title !== undefined && texto(title, { color: c.text, fontSize: fontSize.md, lineHeight: lineHeightPx(fontSize.md), fontFamily: nativeFontFamily[500] })}
        {children !== undefined && texto(children, { color: c.text2, fontSize: fontSize.sm, lineHeight: lineHeightPx(fontSize.sm), fontFamily: nativeFontFamily[400] })}
      </View>
      {withCloseButton && <CloseButton accessibilityLabel={closeButtonLabel} onPress={onClose} color="text2" style={{ margin: -space[3], marginLeft: 0 }} />}
    </View>
  );
}
