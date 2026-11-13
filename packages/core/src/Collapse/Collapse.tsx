import { useComponentProps } from "@countify-oficial/provider";
import type { ComponentPropsWithRef } from "react";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./Collapse.module.css";

export interface CollapseProps extends StylesApiProps<"root" | "inner">, Omit<ComponentPropsWithRef<"div">, "className" | "style"> {
  /** Aberto. */
  in: boolean;
  /** Duração: fast, base ou slow. Padrão: base. */
  duration?: "fast" | "base" | "slow" | undefined;
}

/** Abre e fecha o conteúdo animando a altura. Fechado, o conteúdo sai do Tab e do leitor de tela. */
export function Collapse(props: CollapseProps) {
  const { in: aberto, duration = "base", children, className, style, classNames, styles, ...rest } = useComponentProps("Collapse", {}, props);
  const getStyles = useStyles("Collapse", classes, { className, style, classNames, styles });
  return (
    <div {...rest} data-open={aberto || undefined} {...getStyles("root", { "--collapse-duration": `var(--cf-duration-${duration})` })}>
      <div inert={!aberto} aria-hidden={!aberto || undefined} {...getStyles("inner")}>{children}</div>
    </div>
  );
}
