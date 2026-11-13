import { useComponentProps, useMessages } from "@countify-oficial/provider";
import type { ElementType } from "react";
import { ActionIcon, type ActionIconProps } from "../ActionIcon/ActionIcon";
import { Icon } from "../Icon/Icon";

export type BurgerProps<C extends ElementType = "button"> = Omit<ActionIconProps<C>, "aria-label" | "children"> & {
  /** Aberto: mostra o X e anuncia expandido. */
  opened?: boolean | undefined;
  /** O nome; padrão: "Abrir menu" ou "Fechar menu". */
  "aria-label"?: string | undefined;
};

/** Botão de menu: três traços que viram X quando o menu abre. A identidade não esconde o menu; use onde ele for preciso. */
export function Burger<C extends ElementType = "button">(props: BurgerProps<C>) {
  const messages = useMessages();
  const { opened = false, "aria-label": nome, ...rest } = useComponentProps("Burger", {}, props);
  return (
    <ActionIcon {...(rest as ActionIconProps<C>)} aria-label={nome ?? (opened ? messages.closeMenu : messages.openMenu)} aria-expanded={opened}>
      <Icon name={opened ? "close" : "menu"} />
    </ActionIcon>
  );
}
