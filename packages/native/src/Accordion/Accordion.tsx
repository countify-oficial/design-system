import { useControllableState } from "@countify-oficial/hooks";
import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { borderWidth, compactRowHeight, fontSize, nativeFontFamily, radius, space, state } from "@countify-oficial/tokens";
import { createContext, useContext, type ReactNode } from "react";
import { Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";
import { Collapse } from "../Collapse/Collapse";
import { ContentColor } from "../contentColor";
import { Icon } from "../Icon/Icon";
import { useThemeStyle } from "../styles";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";

export interface AccordionProps {
  multiple?: boolean | undefined;
  value?: string[] | undefined;
  defaultValue?: string[] | undefined;
  onChange?: ((value: string[]) => void) | undefined;
  /** separated: um cartão por item; contained: um cartão só. Padrão: separated. */
  variant?: "separated" | "contained" | undefined;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

interface Contexto {
  abertos: string[];
  alternar: (v: string) => void;
  variante: "separated" | "contained";
}
const AccordionContext = createContext<Contexto | null>(null);
const ItemContext = createContext<{ valor: string; disabled: boolean; primeiro: boolean } | null>(null);

function useAccordionContext() {
  const c = useContext(AccordionContext);
  if (!c) throw new Error("Accordion.Item, Control e Panel ficam dentro de um Accordion");
  return c;
}
function useAccordionItem() {
  const c = useContext(ItemContext);
  if (!c) throw new Error("Accordion.Control e Panel ficam dentro de um Accordion.Item");
  return c;
}

export interface AccordionItemProps {
  value: string;
  disabled?: boolean | undefined;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Um item: Accordion.Control e Accordion.Panel. */
export function AccordionItem(props: AccordionItemProps) {
  const { variante } = useAccordionContext();
  const { value, disabled = false, children, style } = useComponentProps("AccordionItem", {}, props);
  const { colors: c } = useCountifyTheme();
  const item = useContext(ItemContext);
  const separado = variante === "separated";
  return (
    <ItemContext value={{ valor: value, disabled, primeiro: item?.primeiro ?? false }}>
      <View
        style={[
          separado && { borderRadius: radius.md, backgroundColor: c.card, borderWidth: borderWidth.thin, borderColor: c.divider },
          !separado && { borderTopWidth: borderWidth.thin, borderColor: c.divider },
          style,
        ]}
      >
        {children}
      </View>
    </ItemContext>
  );
}

export interface AccordionControlProps {
  chevron?: ReactNode;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** O título que abre e fecha o item. */
export function AccordionControl(props: AccordionControlProps) {
  const { abertos, alternar } = useAccordionContext();
  const { valor, disabled } = useAccordionItem();
  const { chevron, children, style } = useComponentProps("AccordionControl", {}, props);
  const { colors: c } = useCountifyTheme();
  const aberto = abertos.includes(valor);
  return (
    <UnstyledButton
      disabled={disabled}
      accessibilityState={{ expanded: aberto }}
      onPress={() => alternar(valor)}
      style={({ pressed }) => [
        { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: space[3], minHeight: compactRowHeight, paddingVertical: space[2], paddingHorizontal: space[4] },
        pressed && { opacity: state.pressedOpacity },
        disabled && { opacity: state.disabledOpacity },
        style,
      ]}
    >
      {typeof children === "string" ? <RNText style={{ flex: 1, color: c.text, fontSize: fontSize.md, fontFamily: nativeFontFamily[500] }}>{children}</RNText> : children}
      <ContentColor value={c.text2}>
        <View style={{ transform: [{ rotate: aberto ? "180deg" : "0deg" }] }}>{chevron ?? <Icon name="chevron-down" />}</View>
      </ContentColor>
    </UnstyledButton>
  );
}

export interface AccordionPanelProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** O conteúdo do item, que abre com animação. */
export function AccordionPanel(props: AccordionPanelProps) {
  const { abertos } = useAccordionContext();
  const { valor } = useAccordionItem();
  const { children, style } = useComponentProps("AccordionPanel", {}, props);
  const { colors: c } = useCountifyTheme();
  return (
    <Collapse in={abertos.includes(valor)}>
      <View style={[{ gap: space[3], paddingHorizontal: space[4], paddingBottom: space[4] }, style]}>
        {typeof children === "string" ? <RNText style={{ color: c.text, fontSize: fontSize.md, fontFamily: nativeFontFamily[400] }}>{children}</RNText> : children}
      </View>
    </Collapse>
  );
}

function AccordionRoot(props: AccordionProps) {
  const { multiple, value, defaultValue, onChange, variant = "separated", children, style } = useComponentProps("Accordion", {}, props);
  const { colors: c } = useCountifyTheme();
  const tema = useThemeStyle("Accordion");
  const [abertos, setAbertos] = useControllableState<string[]>({ value, defaultValue: defaultValue ?? [], onChange });
  const alternar = (v: string) => setAbertos(abertos.includes(v) ? abertos.filter((a) => a !== v) : multiple ? [...abertos, v] : [v]);
  return (
    <AccordionContext value={{ abertos, alternar, variante: variant }}>
      <View
        style={[
          variant === "separated" ? { gap: space[3] } : { borderRadius: radius.md, backgroundColor: c.card, borderWidth: borderWidth.thin, borderColor: c.divider, overflow: "hidden" },
          tema,
          style,
        ]}
      >
        {children}
      </View>
    </AccordionContext>
  );
}

/** Acordeão: títulos que abrem e fecham o conteúdo. */
export const Accordion = Object.assign(AccordionRoot, { Item: AccordionItem, Control: AccordionControl, Panel: AccordionPanel });
