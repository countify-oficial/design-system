import { useComponentProps } from "@countify-oficial/provider";
import { useState, type ComponentPropsWithRef, type KeyboardEvent, type ReactNode } from "react";
import { Menu, type MenuProps } from "../Menu/Menu";
import { useStyles, type StylesApiProps } from "../styles";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";
import classes from "./Menubar.module.css";

export type MenubarProps = StylesApiProps & Omit<ComponentPropsWithRef<"div">, "className" | "style" | "role">;

export interface MenubarMenuProps extends Omit<MenuProps, "children" | "trigger"> {
  /** O texto do menu na barra ("Arquivo"). */
  label: ReactNode;
  /** Os Menu.Item, Menu.Label e Menu.Divider. */
  children?: ReactNode;
}

const ITEM = "[data-menubar-trigger]";

/** Um menu da barra: o botão na barra e a lista que abre embaixo. */
export function MenubarMenu({ label, children, ...props }: MenubarMenuProps) {
  return (
    <Menu position="bottom-start" {...props}>
      <Menu.Target>
        <UnstyledButton role="menuitem" data-menubar-trigger className={classes["trigger"]}>{label}</UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>{children}</Menu.Dropdown>
    </Menu>
  );
}

/** Barra de menus do aplicativo de computador. Setas para os lados andam entre os menus; para baixo, abre. Só computador. */
function MenubarRoot(props: MenubarProps) {
  const { onKeyDown, className, style, classNames, styles, ...rest } = useComponentProps("Menubar", {}, props);
  const getStyles = useStyles("Menubar", classes, { className, style, classNames, styles });
  const [foco, setFoco] = useState(0);
  const aoTeclar = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    const itens = Array.from(e.currentTarget.querySelectorAll<HTMLElement>(ITEM));
    const i = itens.indexOf(document.activeElement as HTMLElement);
    if (i < 0) return;
    const destino = { ArrowRight: (i + 1) % itens.length, ArrowLeft: (i - 1 + itens.length) % itens.length, Home: 0, End: itens.length - 1 }[e.key];
    if (destino === undefined) return;
    e.preventDefault();
    setFoco(destino);
    itens[destino]?.focus();
  };
  return (
    <div
      role="menubar"
      tabIndex={-1}
      {...rest}
      onKeyDown={aoTeclar}
      // só o menu atual entra no Tab (o resto pelas setas)
      onFocus={(e) => {
        const itens = Array.from(e.currentTarget.querySelectorAll<HTMLElement>(ITEM));
        itens.forEach((el, k) => el.setAttribute("tabindex", k === Math.max(0, itens.indexOf(e.target)) ? "0" : "-1"));
        if (itens.indexOf(e.target) >= 0) setFoco(itens.indexOf(e.target));
      }}
      data-focused-index={foco}
      {...getStyles("root")}
    />
  );
}

/** Menubar: Menubar.Menu para cada menu da barra. */
export const Menubar = Object.assign(MenubarRoot, { Menu: MenubarMenu });
