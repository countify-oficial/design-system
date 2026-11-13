import { useControllableState } from "@countify-oficial/hooks";
import { useComponentProps } from "@countify-oficial/provider";
import { cloneElement, createContext, useContext, type ReactElement, type ReactNode } from "react";
import type { GestureResponderEvent, StyleProp, ViewStyle } from "react-native";
import { Drawer } from "../Drawer/Drawer";

export interface PopoverProps {
  opened?: boolean | undefined;
  defaultOpened?: boolean | undefined;
  onChange?: ((opened: boolean) => void) | undefined;
  /** Título da folha. */
  title?: ReactNode;
  disabled?: boolean | undefined;
  children?: ReactNode;
}

interface Contexto {
  aberto: boolean;
  setAberto: (v: boolean) => void;
  titulo: ReactNode;
  desligado: boolean;
}
const PopoverContext = createContext<Contexto | null>(null);
export function usePopoverContext(): Contexto {
  const c = useContext(PopoverContext);
  if (!c) throw new Error("Popover.Target e Popover.Dropdown ficam dentro de um Popover");
  return c;
}

/** O elemento que abre (um só filho com onPress, como um Button ou ActionIcon). */
export function PopoverTarget({ children }: { children: ReactElement<{ onPress?: ((e: GestureResponderEvent) => void) | undefined; accessibilityState?: object | undefined }> }) {
  const { aberto, setAberto, desligado } = usePopoverContext();
  return cloneElement(children, {
    onPress: (e: GestureResponderEvent) => {
      children.props.onPress?.(e);
      if (!desligado) setAberto(!aberto);
    },
    accessibilityState: { ...children.props.accessibilityState, expanded: aberto },
  });
}

/** O conteúdo: no celular, abre numa folha que sobe (a identidade troca popovers e menus por folha). */
export function PopoverDropdown({ children, style }: { children?: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { aberto, setAberto, titulo } = usePopoverContext();
  return <Drawer opened={aberto} onClose={() => setAberto(false)} title={titulo} position="bottom" style={style}>{children}</Drawer>;
}

function PopoverRoot(props: PopoverProps) {
  const { opened, defaultOpened, onChange, title, disabled = false, children } = useComponentProps("Popover", {}, props);
  const [aberto, setAberto] = useControllableState({ value: opened, defaultValue: defaultOpened ?? false, onChange });
  return <PopoverContext value={{ aberto, setAberto, titulo: title, desligado: disabled }}>{children}</PopoverContext>;
}

/** Popover: Popover.Target e Popover.Dropdown (uma folha no celular). */
export const Popover = Object.assign(PopoverRoot, { Target: PopoverTarget, Dropdown: PopoverDropdown });
