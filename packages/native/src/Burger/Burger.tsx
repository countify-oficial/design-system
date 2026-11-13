import { useComponentProps, useMessages } from "@countify-oficial/provider";
import type { ElementType } from "react";
import type { Pressable } from "react-native";
import { ActionIcon, type ActionIconProps } from "../ActionIcon/ActionIcon";
import { Icon } from "../Icon/Icon";

export type BurgerProps<C extends ElementType = typeof Pressable> = Omit<ActionIconProps<C>, "accessibilityLabel" | "children"> & {
  /** Aberto: mostra o X e anuncia expandido. */
  opened?: boolean | undefined;
  /** O nome; padrão: "Abrir menu" ou "Fechar menu". */
  accessibilityLabel?: string | undefined;
};

/** Botão de menu: três traços que viram X quando o menu abre. */
export function Burger<C extends ElementType = typeof Pressable>(props: BurgerProps<C>) {
  const messages = useMessages();
  const { opened = false, accessibilityLabel, ...rest } = useComponentProps("Burger", {}, props);
  return (
    <ActionIcon
      {...(rest as ActionIconProps<C>)}
      accessibilityLabel={accessibilityLabel ?? (opened ? messages.closeMenu : messages.openMenu)}
      accessibilityState={{ expanded: opened }}
    >
      <Icon name={opened ? "close" : "menu"} />
    </ActionIcon>
  );
}
