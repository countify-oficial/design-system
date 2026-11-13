import { useComponentProps } from "@countify-oficial/provider";
import type { ElementType, ReactNode } from "react";
import type { PolymorphicProps } from "../polymorphic";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./EmptyState.module.css";

export interface EmptyStateOwnProps extends StylesApiProps<"root" | "icon" | "title" | "description" | "actions"> {
  /** Ícone acima do título (um Icon ou um ThemeIcon). */
  icon?: ReactNode;
  /** O que falta ("Nenhuma análise salva"). */
  title: ReactNode;
  /** Uma linha a mais, em texto 2. */
  description?: ReactNode;
  /** A ação ("+ Nova análise"): um Button variant="dashed", por exemplo. */
  children?: ReactNode;
}

export type EmptyStateProps<C extends ElementType = "div"> = PolymorphicProps<C, EmptyStateOwnProps>;

/** Estado vazio: ocupa o lugar do conteúdo, diz o que falta e oferece a ação. */
export function EmptyState<C extends ElementType = "div">(props: EmptyStateProps<C>) {
  const { component, icon, title, description, children, className, style, classNames, styles, ...rest } = useComponentProps("EmptyState", {}, props);
  const getStyles = useStyles("EmptyState", classes, { className, style, classNames, styles });
  const Component: ElementType = component ?? "div";
  return (
    <Component {...rest} {...getStyles("root")}>
      {icon !== undefined && <span {...getStyles("icon")}>{icon}</span>}
      <p {...getStyles("title")}>{title}</p>
      {description !== undefined && <p {...getStyles("description")}>{description}</p>}
      {children !== undefined && <div {...getStyles("actions")}>{children}</div>}
    </Component>
  );
}
