import { useComponentProps } from "@countify-oficial/provider";
import type { Spacing } from "@countify-oficial/tokens";
import type { CSSProperties, ElementType } from "react";
import type { PolymorphicProps } from "../polymorphic";
import { spacingVar, useStyles, type StylesApiProps } from "../styles";
import classes from "./Group.module.css";

export interface GroupOwnProps extends StylesApiProps {
  /** Espaço entre os itens: xs–xl ou degrau da grade de 4 (3 = 12). Padrão: md. */
  gap?: Spacing | undefined;
  /** align-items. Padrão: center. */
  align?: CSSProperties["alignItems"];
  /** justify-content. Padrão: flex-start. */
  justify?: CSSProperties["justifyContent"];
  /** Quebra a linha quando não cabe. Padrão: true. */
  wrap?: boolean | undefined;
  /** Os itens crescem para ocupar a linha. */
  grow?: boolean | undefined;
}

export type GroupProps<C extends ElementType = "div"> = PolymorphicProps<C, GroupOwnProps>;

/** Itens lado a lado, alinhados ao centro, com espaço entre eles. */
export function Group<C extends ElementType = "div">(props: GroupProps<C>) {
  const {
    component, gap = "md", align = "center", justify, wrap = true, grow, className, style, classNames, styles, ...rest
  } = useComponentProps("Group", {}, props);
  const getStyles = useStyles("Group", classes, { className, style, classNames, styles });
  const Component: ElementType = component ?? "div";
  return (
    <Component
      {...rest}
      data-nowrap={!wrap || undefined}
      data-grow={grow || undefined}
      {...getStyles("root", { "--group-gap": spacingVar(gap), "--group-align": align, "--group-justify": justify })}
    />
  );
}
