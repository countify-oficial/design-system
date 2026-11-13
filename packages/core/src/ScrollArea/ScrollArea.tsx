import { useComponentProps } from "@countify-oficial/provider";
import type { ComponentPropsWithRef, UIEvent } from "react";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./ScrollArea.module.css";

export interface ScrollAreaProps extends StylesApiProps, Omit<ComponentPropsWithRef<"div">, "className" | "style"> {
  /** auto: barra quando precisa; always: sempre; never: rola sem barra. Padrão: auto. */
  type?: "auto" | "always" | "never" | undefined;
  /** Para onde rola. Padrão: y. */
  scrollbars?: "x" | "y" | "xy" | undefined;
  onScrollPositionChange?: ((position: { x: number; y: number }) => void) | undefined;
}

/** Área que rola, com barra fina. A altura vem do style (height ou maxHeight). Entra no Tab, para rolar pelo teclado. */
export function ScrollArea(props: ScrollAreaProps) {
  const { type = "auto", scrollbars = "y", onScrollPositionChange, onScroll, className, style, classNames, styles, ...rest } = useComponentProps("ScrollArea", {}, props);
  const getStyles = useStyles("ScrollArea", classes, { className, style, classNames, styles });
  return (
    <div
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- área que rola precisa entrar no Tab para rolar pelo teclado (WCAG 2.1.1)
      tabIndex={0}
      data-type={type}
      data-scrollbars={scrollbars}
      onScroll={(e: UIEvent<HTMLDivElement>) => {
        onScroll?.(e);
        onScrollPositionChange?.({ x: e.currentTarget.scrollLeft, y: e.currentTarget.scrollTop });
      }}
      {...rest}
      {...getStyles("root")}
    />
  );
}
