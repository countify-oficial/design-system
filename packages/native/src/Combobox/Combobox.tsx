import { useControllableState } from "@countify-oficial/hooks";
import { useComponentProps, useCountifyTheme, type ComboboxParsed } from "@countify-oficial/provider";
import { fontSize, nativeFontFamily, overlineTracking, space, state, touchTarget } from "@countify-oficial/tokens";
import { cloneElement, createContext, useContext, type ReactElement, type ReactNode } from "react";
import { Text as RNText, View, type GestureResponderEvent } from "react-native";
import { ContentColor } from "../contentColor";
import { Drawer } from "../Drawer/Drawer";
import { Icon } from "../Icon/Icon";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";

export interface ComboboxProps {
  opened?: boolean | undefined;
  defaultOpened?: boolean | undefined;
  onOpenedChange?: ((opened: boolean) => void) | undefined;
  onOptionSubmit?: ((value: string) => void) | undefined;
  /** Título da folha. */
  title?: ReactNode;
  children?: ReactNode;
}

interface Contexto {
  aberto: boolean;
  setAberto: (v: boolean) => void;
  enviar: (v: string) => void;
  titulo: ReactNode;
}
const ComboboxContext = createContext<Contexto | null>(null);
export function useComboboxContext(): Contexto {
  const c = useContext(ComboboxContext);
  if (!c) throw new Error("As partes do Combobox ficam dentro de um Combobox");
  return c;
}

/** O que abre a folha (um só filho com onPress). */
export function ComboboxTarget({ children }: { children: ReactElement<{ onPress?: ((e: GestureResponderEvent) => void) | undefined; accessibilityState?: object | undefined }> }) {
  const c = useComboboxContext();
  return cloneElement(children, {
    onPress: (e: GestureResponderEvent) => {
      children.props.onPress?.(e);
      c.setAberto(true);
    },
    accessibilityState: { ...children.props.accessibilityState, expanded: c.aberto },
  });
}

/** A lista, numa folha que sobe. */
export function ComboboxDropdown({ children }: { children?: ReactNode }) {
  const c = useComboboxContext();
  return <Drawer opened={c.aberto} onClose={() => c.setAberto(false)} title={c.titulo} position="bottom">{children}</Drawer>;
}

export interface ComboboxOptionProps {
  value: string;
  selected?: boolean | undefined;
  disabled?: boolean | undefined;
  withCheckIcon?: boolean | undefined;
  children?: ReactNode;
}

/** Uma opção: linha de 44 com o check na escolhida. */
export function ComboboxOption({ value, selected, disabled, withCheckIcon = true, children }: ComboboxOptionProps) {
  const c = useComboboxContext();
  const { colors: cor } = useCountifyTheme();
  return (
    <ContentColor value={selected ? cor.accent : cor.text}>
      <UnstyledButton
        accessibilityRole="menuitem"
        accessibilityState={{ selected: !!selected, disabled: !!disabled }}
        disabled={disabled}
        onPress={() => c.enviar(value)}
        style={({ pressed }) => [{ flexDirection: "row", alignItems: "center", gap: space[3], minHeight: touchTarget }, pressed && { opacity: state.pressedOpacity }, disabled && { opacity: state.disabledOpacity }]}
      >
        {withCheckIcon && <View style={{ width: space[6] }}>{selected && <Icon name="check" size="sm" />}</View>}
        {typeof children === "string" ? (
          <RNText style={{ flex: 1, color: selected ? cor.accent : cor.text, fontSize: fontSize.md, fontFamily: nativeFontFamily[selected ? 500 : 400] }}>{children}</RNText>
        ) : (
          children
        )}
      </UnstyledButton>
    </ContentColor>
  );
}

/** Grupo de opções com título. */
export function ComboboxGroup({ label, children }: { label: string; children?: ReactNode }) {
  const { colors: c } = useCountifyTheme();
  return (
    <View>
      <RNText accessibilityRole="header" style={{ paddingTop: space[2], color: c.text2, fontSize: fontSize.xs, fontFamily: nativeFontFamily[700], letterSpacing: fontSize.xs * overlineTracking, textTransform: "uppercase" }}>{label}</RNText>
      {children}
    </View>
  );
}

/** Mensagem quando nada bate. */
export function ComboboxEmpty({ children }: { children?: ReactNode }) {
  const { colors: c } = useCountifyTheme();
  return <RNText style={{ padding: space[3], textAlign: "center", color: c.text2, fontSize: fontSize.sm, fontFamily: nativeFontFamily[400] }}>{children}</RNText>;
}

/** Desenha grupos e opções; nenhuma → vazio. */
export function ComboboxOptions({ grupos, escolhidos, vazio, withCheckIcon }: { grupos: ComboboxParsed[]; escolhidos: string[]; vazio?: ReactNode; withCheckIcon?: boolean | undefined }) {
  if (grupos.length === 0) return vazio === undefined || vazio === null ? null : <ComboboxEmpty>{vazio}</ComboboxEmpty>;
  return grupos.map((g) => {
    const opcoes = g.items.map((i) => (
      <ComboboxOption key={i.value} value={i.value} selected={escolhidos.includes(i.value)} disabled={i.disabled} withCheckIcon={withCheckIcon}>{i.label}</ComboboxOption>
    ));
    return g.group === null ? <View key="__">{opcoes}</View> : <ComboboxGroup key={g.group} label={g.group}>{opcoes}</ComboboxGroup>;
  });
}

function ComboboxRoot(props: ComboboxProps) {
  const { opened, defaultOpened, onOpenedChange, onOptionSubmit, title, children } = useComponentProps("Combobox", {}, props);
  const [aberto, setAberto] = useControllableState({ value: opened, defaultValue: defaultOpened ?? false, onChange: onOpenedChange });
  return <ComboboxContext value={{ aberto, setAberto, enviar: (v) => onOptionSubmit?.(v), titulo: title }}>{children}</ComboboxContext>;
}

/** Combobox do celular: o alvo abre uma folha com as opções. */
export const Combobox = Object.assign(ComboboxRoot, { Target: ComboboxTarget, Dropdown: ComboboxDropdown, Option: ComboboxOption, Group: ComboboxGroup, Empty: ComboboxEmpty });
