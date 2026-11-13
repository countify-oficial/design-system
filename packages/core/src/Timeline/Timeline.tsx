import { useComponentProps } from "@countify-oficial/provider";
import type { Tone } from "@countify-oficial/tokens";
import { Children, createContext, useContext, type ComponentPropsWithRef, type ReactNode } from "react";
import { toneVars, useStyles, type StylesApiProps } from "../styles";
import classes from "./Timeline.module.css";

export interface TimelineProps extends StylesApiProps, Omit<ComponentPropsWithRef<"ol">, "className" | "style" | "color"> {
  /** Índice do último item feito: ele e os anteriores ganham o marcador cheio. Padrão: -1 (nenhum). */
  active?: number | undefined;
  /** Tom dos itens feitos. Padrão: accent. */
  color?: Tone | undefined;
}

export interface TimelineItemProps extends StylesApiProps<"root" | "bullet" | "title" | "body">, Omit<ComponentPropsWithRef<"li">, "className" | "style" | "title"> {
  /** Dentro do marcador (um Icon xs, um número). */
  bullet?: ReactNode;
  title?: ReactNode;
  /** Linha até o próximo: cheia ou tracejada. Padrão: solid. */
  lineVariant?: "solid" | "dashed" | undefined;
  children?: ReactNode;
}

const Estado = createContext({ feito: false, linhaFeita: false });

/** Um passo da Timeline. */
export function TimelineItem(props: TimelineItemProps) {
  const { feito, linhaFeita } = useContext(Estado);
  const { bullet, title, lineVariant = "solid", children, className, style, classNames, styles, ...rest } = useComponentProps("TimelineItem", {}, props);
  const getStyles = useStyles(
    "TimelineItem",
    { root: classes["item"] ?? "", bullet: classes["bullet"] ?? "", title: classes["title"] ?? "", body: classes["body"] ?? "" },
    { className, style, classNames, styles },
  );
  return (
    <li {...rest} data-active={feito || undefined} data-line-active={linhaFeita || undefined} {...getStyles("root", { "--tl-line": lineVariant })}>
      <span aria-hidden {...getStyles("bullet")}>{bullet}</span>
      {title !== undefined && <div {...getStyles("title")}>{title}</div>}
      {children !== undefined && <div {...getStyles("body")}>{children}</div>}
    </li>
  );
}

function TimelineRoot(props: TimelineProps) {
  const { active = -1, color = "accent", children, className, style, classNames, styles, ...rest } = useComponentProps("Timeline", {}, props);
  const getStyles = useStyles("Timeline", classes, { className, style, classNames, styles });
  return (
    <ol {...rest} {...getStyles("root", toneVars(color))}>
      {Children.toArray(children).map((filho, i) => (
        <Estado key={i} value={{ feito: i <= active, linhaFeita: i < active }}>{filho}</Estado>
      ))}
    </ol>
  );
}

/** Linha do tempo: passos em sequência, os feitos com o marcador cheio. Os passos são Timeline.Item. */
export const Timeline = Object.assign(TimelineRoot, { Item: TimelineItem });
