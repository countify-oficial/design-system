import { useComponentProps, useCountifyTheme, useMessages } from "@countify-oficial/provider";
import { borderWidth, fontSize, lineHeightPx, nativeFontFamily, radius, space, type Tone } from "@countify-oficial/tokens";
import { useState, type ReactNode } from "react";
import { Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";
import { CloseButton } from "../CloseButton/CloseButton";
import { Icon } from "../Icon/Icon";
import { useThemeStyle } from "../styles";
import { ThemeIcon } from "../ThemeIcon/ThemeIcon";

export interface AnnouncementProps {
  /** Título, em 17 ("Nova versão do agente"). */
  title: ReactNode;
  /** Ícone dentro do quadrado do tom (ThemeIcon). Padrão: o sino (bell); null tira. */
  icon?: ReactNode;
  /** Tom do quadrado do ícone: accent, up, warn, down ou gray. Padrão: accent. */
  color?: Tone | undefined;
  /** Ação opcional, abaixo do texto: um Button size="sm" ou um Anchor ("Ver o que mudou"). */
  action?: ReactNode;
  /** Controlado: mostra (true) ou esconde (false). Com ele, quem esconde depois de dispensar é o app, no onDismiss. */
  opened?: boolean | undefined;
  /** Não controlado: começa aberto? Padrão: true. */
  defaultOpened?: boolean | undefined;
  /**
   * Chamado ao tocar no ×. No celular não há localStorage (a web tem `storageKey`): para lembrar a dispensa, o app
   * grava no armazenamento dele (AsyncStorage, MMKV) aqui e passa `opened` ao abrir a tela.
   */
  onDismiss?: (() => void) | undefined;
  /** Nome do botão ×. Padrão: "Dispensar" do provider. */
  dismissLabel?: string | undefined;
  /** O texto curto, em 15 e na cor de texto 2. */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string | undefined;
}

/**
 * Novidade que fica na tela até ser dispensada ("Agora dá para exportar em CSV"). Não agrupa o conteúdo para o
 * leitor de tela, para o × continuar alcançável; ao dispensar, o leitor segue para o próximo elemento sozinho (o app
 * pode mover o foco no onDismiss com `AccessibilityInfo.setAccessibilityFocus`).
 */
export function Announcement(props: AnnouncementProps) {
  const { title, icon, color = "accent", action, opened, defaultOpened = true, onDismiss, dismissLabel, children, style, testID } =
    useComponentProps("Announcement", {}, props);
  const { colors: c } = useCountifyTheme();
  const messages = useMessages();
  const tema = useThemeStyle("Announcement");
  const [aberto, setAberto] = useState(defaultOpened);
  if (!(opened ?? aberto)) return null;

  const texto = (conteudo: ReactNode, s: object) => (typeof conteudo === "string" ? <RNText style={s}>{conteudo}</RNText> : conteudo);
  return (
    <View
      testID={testID}
      style={[
        { flexDirection: "row", alignItems: "flex-start", gap: space[3], padding: space[4], borderRadius: radius.md, backgroundColor: c.card, borderWidth: borderWidth.thin, borderColor: c.divider },
        tema,
        style,
      ]}
    >
      {icon !== null && <ThemeIcon color={color}>{icon ?? <Icon name="bell" />}</ThemeIcon>}
      <View style={{ flex: 1, gap: space[1] }}>
        {texto(title, { color: c.text, fontSize: fontSize.md, lineHeight: lineHeightPx(fontSize.md), fontFamily: nativeFontFamily[500] })}
        {children !== undefined && texto(children, { color: c.text2, fontSize: fontSize.sm, lineHeight: lineHeightPx(fontSize.sm), fontFamily: nativeFontFamily[400] })}
        {action !== undefined && <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2], marginTop: space[1] }}>{action}</View>}
      </View>
      <CloseButton
        accessibilityLabel={dismissLabel ?? messages.dismiss}
        onPress={() => {
          setAberto(false);
          onDismiss?.();
        }}
        color="text2"
        style={{ margin: -space[3], marginLeft: 0 }}
      />
    </View>
  );
}
