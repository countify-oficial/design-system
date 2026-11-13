import { useControllableState } from "@countify-oficial/hooks";
import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { borderWidth, fontSize, nativeFontFamily, radius, space, state, touchTarget } from "@countify-oficial/tokens";
import { createContext, useContext, type ReactNode } from "react";
import { ScrollView, Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";
import { ContentColor } from "../contentColor";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";

export type TabsVariant = "segmented" | "pills" | "chips";

export interface TabsProps {
  value?: string | null | undefined;
  defaultValue?: string | null | undefined;
  onChange?: ((value: string | null) => void) | undefined;
  /** segmented: o "Segmentado" do mockup; pills: a pílula do menu; chips: fileira que rola. Padrão: segmented. */
  variant?: TabsVariant | undefined;
  /** Mantém os painéis fechados montados (escondidos). Padrão: false. */
  keepMounted?: boolean | undefined;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

interface Contexto {
  valor: string | null;
  abrir: (v: string) => void;
  variant: TabsVariant;
  keepMounted: boolean;
}
const TabsContext = createContext<Contexto | null>(null);
function useTabs(): Contexto {
  const c = useContext(TabsContext);
  if (!c) throw new Error("Tabs.List, Tabs.Tab e Tabs.Panel ficam dentro de um Tabs");
  return c;
}

function TabsRoot(props: TabsProps) {
  const { value, defaultValue, onChange, variant = "segmented", keepMounted = false, children, style } = useComponentProps("Tabs", {}, props);
  const [valor, setValor] = useControllableState<string | null>({ value, defaultValue: defaultValue ?? null, onChange });
  return (
    <TabsContext value={{ valor, abrir: setValor, variant, keepMounted }}>
      <View style={[{ gap: space[4] }, style]}>{children}</View>
    </TabsContext>
  );
}

export interface TabsListProps {
  /** As abas dividem a largura toda. Padrão: true no segmented. */
  grow?: boolean | undefined;
  accessibilityLabel?: string | undefined;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** A lista de abas (tablist). Os chips rolam para o lado. */
export function TabsList(props: TabsListProps) {
  const c = useTabs();
  const { colors: cor } = useCountifyTheme();
  const { grow = c.variant === "segmented", accessibilityLabel, children, style } = useComponentProps("TabsList", {}, props);
  const base: ViewStyle = { flexDirection: "row", gap: c.variant === "chips" ? space[2] : space[1] };
  if (c.variant === "chips") {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} accessibilityRole="tablist" accessibilityLabel={accessibilityLabel} contentContainerStyle={base} style={style}>
        {children}
      </ScrollView>
    );
  }
  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
      style={[base, c.variant === "segmented" && { padding: space[1], borderRadius: radius.sm, backgroundColor: cor.card }, !grow && { alignSelf: "flex-start" }, style]}
    >
      <GrowContext value={grow}>{children}</GrowContext>
    </View>
  );
}
const GrowContext = createContext(false);

export interface TabsTabProps {
  value: string;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  disabled?: boolean | undefined;
  children?: ReactNode;
}

/** Uma aba. */
export function TabsTab(props: TabsTabProps) {
  const c = useTabs();
  const crescer = useContext(GrowContext);
  const { colors: cor } = useCountifyTheme();
  const { value, leftSection, rightSection, disabled, children } = useComponentProps("TabsTab", {}, props);
  const aberta = c.valor === value;
  const corTexto = aberta ? cor.accent : c.variant === "segmented" ? cor.text : c.variant === "chips" ? cor.text2 : cor.label;
  const anel = c.variant !== "pills";
  return (
    <ContentColor value={corTexto}>
      <UnstyledButton
        accessibilityRole="tab"
        accessibilityState={{ selected: aberta, disabled: !!disabled }}
        disabled={disabled}
        onPress={() => c.abrir(value)}
        style={({ pressed }) => [
          {
            flex: crescer ? 1 : undefined, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: space[2], minHeight: touchTarget, paddingHorizontal: space[3],
            borderRadius: c.variant === "segmented" ? radius.xs : radius.sm,
          },
          c.variant === "chips" && { backgroundColor: cor.card, borderWidth: borderWidth.thin, borderColor: cor.divider },
          aberta && { backgroundColor: cor.accentTint },
          aberta && anel && { borderWidth: borderWidth.thick, borderColor: cor.accent },
          pressed && { opacity: state.pressedOpacity },
          disabled && { opacity: state.disabledOpacity },
        ]}
      >
        {leftSection}
        {typeof children === "string" ? <RNText style={{ color: corTexto, fontSize: fontSize.sm, fontFamily: nativeFontFamily[500] }}>{children}</RNText> : children}
        {rightSection}
      </UnstyledButton>
    </ContentColor>
  );
}

export interface TabsPanelProps {
  value: string;
  keepMounted?: boolean | undefined;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** O conteúdo de uma aba. */
export function TabsPanel(props: TabsPanelProps) {
  const c = useTabs();
  const { value, keepMounted, children, style } = useComponentProps("TabsPanel", {}, props);
  const aberta = c.valor === value;
  if (!aberta && !(keepMounted ?? c.keepMounted)) return null;
  return <View style={[!aberta && { display: "none" }, style]}>{children}</View>;
}

/** Abas: Tabs.List com Tabs.Tab e um Tabs.Panel por aba. */
export const Tabs = Object.assign(TabsRoot, { List: TabsList, Tab: TabsTab, Panel: TabsPanel });
