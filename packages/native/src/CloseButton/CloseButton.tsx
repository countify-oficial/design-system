import { useMessages } from "@countify-oficial/provider";
import type { ElementType } from "react";
import type { Pressable } from "react-native";
import { ActionIcon, type ActionIconProps } from "../ActionIcon/ActionIcon";
import { Icon } from "../Icon/Icon";

export type CloseButtonProps<C extends ElementType = typeof Pressable> = Omit<ActionIconProps<C>, "accessibilityLabel" | "children"> & {
  /** Nome para o leitor de tela. Padrão: o texto "Fechar" do provider. */
  accessibilityLabel?: string | undefined;
};

/** Botão de fechar (×), com o nome "Fechar" para o leitor de tela. */
export function CloseButton<C extends ElementType = typeof Pressable>({ accessibilityLabel, ...props }: CloseButtonProps<C>) {
  const messages = useMessages();
  const acao = { ...props, accessibilityLabel: accessibilityLabel ?? messages.close } as ActionIconProps<C>;
  return <ActionIcon {...acao}><Icon name="close" /></ActionIcon>;
}
