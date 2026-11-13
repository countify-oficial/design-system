import { useMessages } from "@countify-oficial/provider";
import type { ElementType } from "react";
import { ActionIcon, type ActionIconProps } from "../ActionIcon/ActionIcon";
import { Icon } from "../Icon/Icon";

export type CloseButtonProps<C extends ElementType = "button"> = Omit<ActionIconProps<C>, "aria-label" | "children"> & {
  /** Nome para o leitor de tela. Padrão: o texto "Fechar" do provider. */
  "aria-label"?: string | undefined;
};

/** Botão de fechar (×), com o nome "Fechar" para o leitor de tela. */
export function CloseButton<C extends ElementType = "button">({ "aria-label": nome, ...props }: CloseButtonProps<C>) {
  const messages = useMessages();
  const acao = { ...props, "aria-label": nome ?? messages.close } as ActionIconProps<C>;
  return <ActionIcon {...acao}><Icon name="close" /></ActionIcon>;
}
