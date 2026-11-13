import { useComponentProps } from "@countify-oficial/provider";
import type { Size, Spacing } from "@countify-oficial/tokens";
import { createContext, useContext, type ComponentPropsWithRef, type ElementType, type ReactNode } from "react";
import { spacingVar, useStyles, type StylesApiProps } from "../styles";
import classes from "./List.module.css";

export interface ListProps extends StylesApiProps, Omit<ComponentPropsWithRef<"ul">, "className" | "style" | "type"> {
  /** Com marcadores (ul) ou numerada (ol). Padrão: unordered. */
  type?: "unordered" | "ordered" | undefined;
  /** Espaço entre os itens. Padrão: xs (4). */
  spacing?: Spacing | undefined;
  /** Tamanho da letra. Padrão: md (17). */
  size?: Size | undefined;
  /** Ícone no lugar do marcador, para todos os itens. */
  icon?: ReactNode;
}

export interface ListItemProps extends StylesApiProps<"root" | "icon">, Omit<ComponentPropsWithRef<"li">, "className" | "style"> {
  /** Ícone só deste item. */
  icon?: ReactNode;
}

const IconeDaLista = createContext<ReactNode>(undefined);

/** Um item da List. */
export function ListItem(props: ListItemProps) {
  const doList = useContext(IconeDaLista);
  const { icon = doList, children, className, style, classNames, styles, ...rest } = useComponentProps("ListItem", {}, props);
  const getStyles = useStyles("ListItem", { root: classes["item"] ?? "", icon: classes["icon"] ?? "" }, { className, style, classNames, styles });
  return (
    <li {...rest} data-with-icon={icon !== undefined || undefined} {...getStyles("root")}>
      {icon !== undefined && <span {...getStyles("icon")}>{icon}</span>}
      {icon !== undefined ? <span>{children}</span> : children}
    </li>
  );
}

function ListRoot(props: ListProps) {
  const { type = "unordered", spacing = "xs", size = "md", icon, className, style, classNames, styles, ...rest } = useComponentProps("List", {}, props);
  const getStyles = useStyles("List", classes, { className, style, classNames, styles });
  const Tag = (type === "ordered" ? "ol" : "ul") as ElementType;
  return (
    <IconeDaLista value={icon}>
      <Tag {...rest} data-with-icon={icon !== undefined || undefined} {...getStyles("root", { "--list-spacing": spacingVar(spacing), "--list-fz": `var(--cf-font-size-${size})` })} />
    </IconeDaLista>
  );
}

/** Lista de texto, com marcadores, números ou ícones. */
export const List = Object.assign(ListRoot, { Item: ListItem });
