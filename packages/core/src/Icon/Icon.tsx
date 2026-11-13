import { useComponentProps } from "@countify-oficial/provider";
import { iconGrid, icons, type IconName, type Size } from "@countify-oficial/tokens";
import type { ComponentPropsWithRef } from "react";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./Icon.module.css";

export interface IconProps extends StylesApiProps, Omit<ComponentPropsWithRef<"svg">, "className" | "style" | "children" | "dangerouslySetInnerHTML"> {
  /** Qual ícone da Countify (close, plus, search, chevron-down…). */
  name: IconName;
  /** Tamanho: xs 16, sm 18, md 22, lg 28, xl 32. Padrão: md. */
  size?: Size | undefined;
  /** Nome para o leitor de tela. Sem ele, o ícone é decorativo (aria-hidden). */
  label?: string | undefined;
}

/** Ícone da Countify: traço de 1,8 numa caixa de 22, na cor do texto. */
export function Icon(props: IconProps) {
  const { name, size = "md", label, className, style, classNames, styles, ...rest } = useComponentProps("Icon", {}, props);
  const getStyles = useStyles("Icon", classes, { className, style, classNames, styles });
  return (
    <svg
      viewBox={`0 0 ${iconGrid.box} ${iconGrid.box}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={iconGrid.stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      {...rest}
      // desenho fixo dos tokens, nunca texto do usuário
      dangerouslySetInnerHTML={{ __html: icons[name] }}
      {...getStyles("root", { "--icon-size": `var(--cf-icon-size-${size})` })}
    />
  );
}
