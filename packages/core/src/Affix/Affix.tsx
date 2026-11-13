import { useComponentProps } from "@countify-oficial/provider";
import type { Spacing, zIndex } from "@countify-oficial/tokens";
import type { ComponentPropsWithRef } from "react";
import { Portal } from "../Portal/Portal";
import { spacingVar, useStyles, type StylesApiProps } from "../styles";
import classes from "./Affix.module.css";

export interface AffixProps extends StylesApiProps, Omit<ComponentPropsWithRef<"div">, "className" | "style"> {
  /** Distância de cada borda da tela. Padrão: embaixo e à direita, lg (24). */
  position?: { top?: Spacing; right?: Spacing; bottom?: Spacing; left?: Spacing } | undefined;
  /** Camada. Padrão: app. */
  zIndex?: keyof typeof zIndex | undefined;
  /** Desenha dentro do Portal (fim do <body>). Padrão: true. */
  withinPortal?: boolean | undefined;
}

/** Fixa o conteúdo num lugar da tela (um botão de voltar ao topo, um atalho). */
export function Affix(props: AffixProps) {
  const { position = { bottom: "lg", right: "lg" }, zIndex = "app", withinPortal = true, className, style, classNames, styles, ...rest } = useComponentProps("Affix", {}, props);
  const getStyles = useStyles("Affix", classes, { className, style, classNames, styles });
  const caixa = (
    <div
      {...rest}
      {...getStyles("root", {
        "--affix-z": `var(--cf-z-${zIndex})`,
        "--affix-top": spacingVar(position.top),
        "--affix-right": spacingVar(position.right),
        "--affix-bottom": spacingVar(position.bottom),
        "--affix-left": spacingVar(position.left),
      })}
    />
  );
  return withinPortal ? <Portal>{caixa}</Portal> : caixa;
}
