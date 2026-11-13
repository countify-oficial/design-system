import { useComponentProps } from "@countify-oficial/provider";
import type { Size } from "@countify-oficial/tokens";
import type { ComponentPropsWithRef, CSSProperties, ReactNode } from "react";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./Skeleton.module.css";

export interface SkeletonProps extends StylesApiProps, Omit<ComponentPropsWithRef<"span">, "className" | "style" | "children"> {
  /** Mostra o bloco (true) ou o conteúdo (false). Padrão: true. */
  visible?: boolean | undefined;
  /** Altura (número em px ou valor CSS). Padrão: 16. */
  height?: CSSProperties["height"];
  /** Largura. Padrão: 100%. */
  width?: CSSProperties["width"];
  /** Círculo com o lado da altura (avatar). */
  circle?: boolean | undefined;
  /** Canto. Padrão: 4, como no mockup. */
  radius?: Size | undefined;
  /** Pulsa. Padrão: true (para com "reduzir movimento"). */
  animate?: boolean | undefined;
  /** O conteúdo, mostrado quando visible é false. */
  children?: ReactNode;
}

const medida = (v: CSSProperties["height"]) => (typeof v === "number" ? `${v}px` : v);

/** Bloco cinza no lugar do conteúdo que ainda carrega. Ponha aria-busy no contêiner. */
export function Skeleton(props: SkeletonProps) {
  const { visible = true, height, width, circle, radius, animate = true, children, className, style, classNames, styles, ...rest } =
    useComponentProps("Skeleton", {}, props);
  const getStyles = useStyles("Skeleton", classes, { className, style, classNames, styles });
  if (!visible) return children;
  return (
    <span
      aria-hidden
      {...rest}
      data-circle={circle || undefined}
      data-animate={animate || undefined}
      {...getStyles("root", {
        "--sk-height": medida(height),
        "--sk-width": medida(width),
        "--sk-radius": radius && `var(--cf-radius-${radius})`,
      })}
    />
  );
}
