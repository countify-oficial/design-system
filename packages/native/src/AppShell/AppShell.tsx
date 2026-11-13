import { useComponentProps, useCountifyTheme, useMessages } from "@countify-oficial/provider";
import { appShell, borderWidth, fontSize, gutter, nativeFontFamily, radius, space, state, touchTarget, type IconName } from "@countify-oficial/tokens";
import { createContext, useContext, type ReactNode } from "react";
import { ScrollView, Text as RNText, View, type GestureResponderEvent, type StyleProp, type ViewStyle } from "react-native";
import { ContentColor } from "../contentColor";
import { Icon } from "../Icon/Icon";
import { useResponsive } from "../styles";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";

interface Contexto {
  /** O espaço que o sistema ocupa em cima e embaixo (do react-native-safe-area-context). */
  insets: { top: number; bottom: number };
  tablet: boolean;
}
const ShellContext = createContext<Contexto>({ insets: { top: 0, bottom: 0 }, tablet: false });
const Lugar = createContext<"header" | "tabs">("tabs");

export interface AppShellProps {
  /** O espaço do sistema (câmera, gestos). Passe os do react-native-safe-area-context. Padrão: 0. */
  safeAreaInsets?: { top: number; bottom: number } | undefined;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** A moldura do app: abas embaixo no celular; no tablet (a partir de 768), o cabeçalho com o menu. */
function AppShellRoot(props: AppShellProps) {
  const { safeAreaInsets = { top: 0, bottom: 0 }, children, style } = useComponentProps("AppShell", {}, props);
  const { colors: c } = useCountifyTheme();
  const tablet = useResponsive({ base: "nao", sm: "sim" }) === "sim";
  return (
    <ShellContext value={{ insets: safeAreaInsets, tablet }}>
      <View style={[{ flex: 1, backgroundColor: c.bg }, style]}>{children}</View>
    </ShellContext>
  );
}

export interface AppShellHeaderProps {
  logo?: ReactNode;
  end?: ReactNode;
  children?: ReactNode;
}

/** Cabeçalho de 64 com o menu (só no tablet; no celular, as abas embaixo fazem esse papel). */
export function AppShellHeader(props: AppShellHeaderProps) {
  const s = useContext(ShellContext);
  const { colors: c } = useCountifyTheme();
  const messages = useMessages();
  const { logo, end, children } = useComponentProps("AppShellHeader", {}, props);
  if (!s.tablet) return null;
  return (
    <View
      style={{
        flexDirection: "row", alignItems: "center", gap: space[8], height: appShell.headerHeight + s.insets.top, paddingTop: s.insets.top, paddingHorizontal: gutter.desktop,
        backgroundColor: c.nav, borderBottomWidth: borderWidth.thin, borderBottomColor: c.divider,
      }}
    >
      {logo}
      <View accessibilityRole="menubar" accessibilityLabel={messages.sections} style={{ flexDirection: "row", gap: space[1] }}>
        <Lugar value="header">{children}</Lugar>
      </View>
      {end !== undefined && <View style={{ marginLeft: "auto", flexDirection: "row", alignItems: "center", gap: space[3] }}>{end}</View>}
    </View>
  );
}

export interface AppShellMainProps {
  children?: ReactNode;
  /** Rola o conteúdo. Padrão: true. */
  scrollable?: boolean | undefined;
  style?: StyleProp<ViewStyle>;
}

/** O conteúdo da tela: margens de 20 (32 no tablet) e espaço para as abas embaixo. */
export function AppShellMain(props: AppShellMainProps) {
  const s = useContext(ShellContext);
  const { children, scrollable = true, style } = useComponentProps("AppShellMain", {}, props);
  const recuo = s.tablet ? gutter.desktop : gutter.mobile;
  const abas = s.tablet ? 0 : appShell.tabItemHeight + space[1] * 2 + space[4] * 2 + s.insets.bottom;
  const estilo: ViewStyle = { paddingHorizontal: recuo, paddingTop: recuo + (s.tablet ? 0 : s.insets.top), paddingBottom: recuo + abas };
  return scrollable ? <ScrollView style={[{ flex: 1 }, style]} contentContainerStyle={estilo}>{children}</ScrollView> : <View style={[{ flex: 1 }, estilo, style]}>{children}</View>;
}

export interface AppShellTabBarProps {
  children?: ReactNode;
}

/** Abas embaixo, no celular: barra de canto 20 a 16 das bordas, acima da área dos gestos. */
export function AppShellTabBar(props: AppShellTabBarProps) {
  const s = useContext(ShellContext);
  const { colors: c } = useCountifyTheme();
  const messages = useMessages();
  const { children } = useComponentProps("AppShellTabBar", {}, props);
  if (s.tablet) return null;
  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel={messages.sections}
      style={{
        position: "absolute", left: space[4], right: space[4], bottom: space[4] + s.insets.bottom, flexDirection: "row", gap: space[1], padding: space[1], borderRadius: radius.lg,
        backgroundColor: c.card, borderWidth: borderWidth.thin, borderColor: c.divider,
      }}
    >
      <Lugar value="tabs">{children}</Lugar>
    </View>
  );
}

export interface AppShellNavItemProps {
  icon: IconName;
  label: string;
  active?: boolean | undefined;
  /** Contagem no cabeçalho (as abas do celular não mostram). */
  badge?: ReactNode;
  onPress?: ((e: GestureResponderEvent) => void) | undefined;
}

/** Um item do menu: ícone sobre o nome nas abas; pílula com ícone e nome no cabeçalho. */
export function AppShellNavItem(props: AppShellNavItemProps) {
  const lugar = useContext(Lugar);
  const { colors: c } = useCountifyTheme();
  const { icon, label, active, badge, onPress } = useComponentProps("AppShellNavItem", {}, props);
  const abas = lugar === "tabs";
  const cor = active ? c.accent : abas ? c.text2 : c.label;
  return (
    <ContentColor value={cor}>
      <UnstyledButton
        accessibilityRole={abas ? "tab" : "menuitem"}
        accessibilityLabel={label}
        accessibilityState={{ selected: !!active }}
        onPress={onPress}
        style={({ pressed }) => [
          abas
            ? { flex: 1, minHeight: appShell.tabItemHeight, alignItems: "center", justifyContent: "center", gap: space[1], paddingHorizontal: space[1], borderRadius: radius.md }
            : { flexDirection: "row", alignItems: "center", gap: space[2], minHeight: touchTarget, paddingHorizontal: space[3], borderRadius: radius.sm },
          active && { backgroundColor: c.accentTint },
          pressed && { opacity: state.pressedOpacity },
        ]}
      >
        <Icon name={icon} size={abas ? appShell.tabIconSize : appShell.menuIconSize} />
        <RNText numberOfLines={1} style={{ color: cor, fontSize: abas ? fontSize.xs : fontSize.sm, fontFamily: nativeFontFamily[500] }}>{label}</RNText>
        {!abas && badge}
      </UnstyledButton>
    </ContentColor>
  );
}

/** AppShell com Header, Main, TabBar e NavItem. */
export const AppShell = Object.assign(AppShellRoot, { Header: AppShellHeader, Main: AppShellMain, TabBar: AppShellTabBar, NavItem: AppShellNavItem });
