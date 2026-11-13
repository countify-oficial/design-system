import { useComponentProps, useMessages } from "@countify-oficial/provider";
import { Children, isValidElement, type ComponentPropsWithRef, type ReactNode } from "react";
import { Icon } from "../Icon/Icon";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./Breadcrumbs.module.css";

export interface BreadcrumbsProps extends StylesApiProps<"root" | "list" | "item" | "separator">, Omit<ComponentPropsWithRef<"nav">, "className" | "style"> {
  /** Entre os itens. Padrão: a seta para a direita. */
  separator?: ReactNode;
  /** Os níveis, do primeiro à tela atual (Anchor nos de cima; o último, texto). */
  children?: ReactNode;
}

/** O caminho até a tela atual. O último item é a tela atual (aria-current). No celular, prefira o link Voltar. */
export function Breadcrumbs(props: BreadcrumbsProps) {
  const messages = useMessages();
  const { separator = <Icon name="chevron-right" size="xs" />, children, className, style, classNames, styles, ...rest } = useComponentProps("Breadcrumbs", {}, props);
  const getStyles = useStyles("Breadcrumbs", classes, { className, style, classNames, styles });
  const itens = Children.toArray(children);
  return (
    <nav aria-label={messages.breadcrumbs} {...rest} {...getStyles("root")}>
      <ol {...getStyles("list")}>
        {itens.map((item, i) => {
          const ultimo = i === itens.length - 1;
          return [
            i > 0 && (
              <li key={`s${String(i)}`} aria-hidden {...getStyles("separator")}>
                {separator}
              </li>
            ),
            <li key={isValidElement(item) && item.key !== null ? item.key : i} aria-current={ultimo ? "page" : undefined} {...getStyles("item")}>
              {item}
            </li>,
          ];
        })}
      </ol>
    </nav>
  );
}
