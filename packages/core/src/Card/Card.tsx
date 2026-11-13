import { useComponentProps } from "@countify-oficial/provider";
import type { Size, Spacing } from "@countify-oficial/tokens";
import type { ElementType } from "react";
import { Paper } from "../Paper/Paper";
import type { PolymorphicProps } from "../polymorphic";
import { spacingVar, useStyles, type StylesApiProps } from "../styles";
import classes from "./Card.module.css";

export interface CardOwnProps extends StylesApiProps {
  /** Recuo: xs–xl ou degrau da grade de 4. Padrão: md (16). */
  padding?: Spacing | undefined;
  /** Espaço entre os filhos. Padrão: md (16). */
  gap?: Spacing | undefined;
  /** Elevação. Padrão: xs (o anel dos cartões). */
  shadow?: Size | undefined;
  /** Canto. Padrão: md (16). */
  radius?: Size | undefined;
}

export type CardProps<C extends ElementType = "div"> = PolymorphicProps<C, CardOwnProps>;

export interface CardSectionOwnProps extends StylesApiProps {
  /** Linha da divisória entre a seção e o resto. */
  withBorder?: boolean | undefined;
}

export type CardSectionProps<C extends ElementType = "div"> = PolymorphicProps<C, CardSectionOwnProps>;

/** Parte do cartão que encosta nas bordas (uma imagem, uma lista). */
export function CardSection<C extends ElementType = "div">(props: CardSectionProps<C>) {
  const { component, withBorder, className, style, classNames, styles, ...rest } = useComponentProps("CardSection", {}, props);
  const getStyles = useStyles("CardSection", { root: classes["section"] ?? "" }, { className, style, classNames, styles });
  const Component: ElementType = component ?? "div";
  return <Component {...rest} data-with-border={withBorder || undefined} {...getStyles("root")} />;
}

function CardRoot<C extends ElementType = "div">(props: CardProps<C>) {
  const { component, padding = "md", gap = "md", shadow = "xs", radius = "md", className, style, classNames, styles, ...rest } =
    useComponentProps("Card", {}, props);
  const getStyles = useStyles("Card", classes, { className, style, classNames, styles });
  return (
    <Paper
      component={component as ElementType}
      shadow={shadow}
      radius={radius}
      {...rest}
      {...getStyles("root", { "--card-padding": spacingVar(padding), "--card-gap": spacingVar(gap) })}
    />
  );
}

/** Cartão da Countify: recuo de 16, canto de 16 e o anel. Card.Section encosta nas bordas. */
export const Card = Object.assign(CardRoot, { Section: CardSection });
