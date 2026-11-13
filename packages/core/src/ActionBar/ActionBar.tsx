import { useComponentProps } from "@countify-oficial/provider";
import type { ComponentPropsWithRef } from "react";
import { Portal } from "../Portal/Portal";
import { useStyles, type StylesApiProps } from "../styles";
import { Transition } from "../Transition/Transition";
import classes from "./ActionBar.module.css";

export interface ActionBarProps extends StylesApiProps, Omit<ComponentPropsWithRef<"div">, "className" | "style"> {
  /** Mostra a barra (quando há itens escolhidos, por exemplo). */
  opened: boolean;
  /** Nome da barra para o leitor de tela ("Ações das lojas escolhidas"). */
  "aria-label": string;
}

/** Barra de ações que sobe do pé da tela quando há itens escolhidos ("3 lojas · Mover · Excluir"). */
export function ActionBar(props: ActionBarProps) {
  const { opened, className, style, classNames, styles, ...rest } = useComponentProps("ActionBar", {}, props);
  const getStyles = useStyles("ActionBar", classes, { className, style, classNames, styles });
  return (
    <Portal>
      <Transition mounted={opened} transition="slide-up" duration="base">
        {(s) => <div role="toolbar" {...rest} {...getStyles("root")} style={{ ...getStyles("root").style, ...s }} />}
      </Transition>
    </Portal>
  );
}
