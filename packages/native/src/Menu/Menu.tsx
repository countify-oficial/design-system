import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { borderWidth, compactRowHeight, fontSize, nativeFontFamily, overlineTracking, space, state, type ColorRole } from "@countify-oficial/tokens";
import type { ReactNode } from "react";
import { Text as RNText, View, type GestureResponderEvent } from "react-native";
import { ContentColor } from "../contentColor";
import { Popover, PopoverDropdown, PopoverTarget, usePopoverContext, type PopoverProps } from "../Popover/Popover";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";

export interface MenuItemProps {
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  /** Papel de cor (down para "Excluir"). */
  color?: ColorRole | undefined;
  onPress?: ((e: GestureResponderEvent) => void) | undefined;
  /** Mantém a folha aberta ao escolher. */
  closeMenuOnClick?: boolean | undefined;
  disabled?: boolean | undefined;
  children?: ReactNode;
}

/** Um item do menu: uma linha de 56 na folha. */
export function MenuItem(props: MenuItemProps) {
  const { setAberto } = usePopoverContext();
  const { leftSection, rightSection, color, onPress, closeMenuOnClick = true, disabled, children } = useComponentProps("MenuItem", {}, props);
  const { colors: c } = useCountifyTheme();
  const cor = color ? c[color] : c.text;
  return (
    <ContentColor value={color ? cor : c.text2}>
      <UnstyledButton
        accessibilityRole="menuitem"
        disabled={disabled}
        onPress={(e: GestureResponderEvent) => {
          onPress?.(e);
          if (closeMenuOnClick) setAberto(false);
        }}
        style={({ pressed }) => [{ flexDirection: "row", alignItems: "center", gap: space[3], minHeight: compactRowHeight }, pressed && { opacity: state.pressedOpacity }, disabled && { opacity: state.disabledOpacity }]}
      >
        {leftSection}
        {typeof children === "string" ? <RNText style={{ flex: 1, color: cor, fontSize: fontSize.md, fontFamily: nativeFontFamily[400] }}>{children}</RNText> : children}
        {rightSection}
      </UnstyledButton>
    </ContentColor>
  );
}

/** Título de um grupo. */
export function MenuLabel({ children }: { children?: string }) {
  const { colors: c } = useCountifyTheme();
  return <RNText accessibilityRole="header" style={{ color: c.text2, fontSize: fontSize.xs, fontFamily: nativeFontFamily[700], letterSpacing: fontSize.xs * overlineTracking, textTransform: "uppercase", paddingTop: space[2] }}>{children}</RNText>;
}

/** Linha entre grupos. */
export function MenuDivider() {
  const { colors: c } = useCountifyTheme();
  return <View style={{ borderTopWidth: borderWidth.thin, borderColor: c.divider, marginVertical: space[1] }} />;
}

/** A lista do menu, numa folha. */
export function MenuDropdown({ children }: { children?: ReactNode }) {
  return <PopoverDropdown><View accessibilityRole="menu">{children}</View></PopoverDropdown>;
}

function MenuRoot(props: PopoverProps) {
  const p = useComponentProps("Menu", {}, props);
  return <Popover {...p} />;
}

/** Menu de ações: no celular, uma folha com as ações em linhas de 56. */
export const Menu = Object.assign(MenuRoot, { Target: PopoverTarget, Dropdown: MenuDropdown, Item: MenuItem, Label: MenuLabel, Divider: MenuDivider });
