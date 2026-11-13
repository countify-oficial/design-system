import { useComponentProps } from "@countify-oficial/provider";
import { useEffect, useState, type ComponentPropsWithRef } from "react";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./FloatingIndicator.module.css";

export interface FloatingIndicatorProps extends StylesApiProps, Omit<ComponentPropsWithRef<"div">, "className" | "style"> {
  /** O item ativo (o destaque vai até ele). */
  target: HTMLElement | null | undefined;
  /** O contêiner dos itens (precisa de position: relative). */
  parent: HTMLElement | null | undefined;
}

/** Destaque que corre até o item ativo, com animação (abas e segmentados próprios). Decorativo. */
export function FloatingIndicator(props: FloatingIndicatorProps) {
  const { target, parent, className, style, classNames, styles, ...rest } = useComponentProps("FloatingIndicator", {}, props);
  const getStyles = useStyles("FloatingIndicator", classes, { className, style, classNames, styles });
  const [caixa, setCaixa] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  useEffect(() => {
    if (!target || !parent) return;
    const medir = () => {
      const p = parent.getBoundingClientRect();
      const t = target.getBoundingClientRect();
      setCaixa({ top: t.top - p.top + parent.scrollTop, left: t.left - p.left + parent.scrollLeft, width: t.width, height: t.height });
    };
    // o ResizeObserver avisa ao começar e a cada mudança de tamanho
    const observador = new ResizeObserver(medir);
    observador.observe(target);
    observador.observe(parent);
    return () => observador.disconnect();
  }, [target, parent]);
  if (!caixa) return null;
  return (
    <div
      aria-hidden
      {...rest}
      {...getStyles("root", { "--fi-top": `${caixa.top}px`, "--fi-left": `${caixa.left}px`, "--fi-width": `${caixa.width}px`, "--fi-height": `${caixa.height}px` })}
    />
  );
}
