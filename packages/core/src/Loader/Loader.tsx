import { useComponentProps, useMessages } from "@countify-oficial/provider";
import type { ColorRole, Size } from "@countify-oficial/tokens";
import type { ComponentPropsWithRef } from "react";
import { colorVar, useStyles, type StylesApiProps } from "../styles";
import classes from "./Loader.module.css";

export interface LoaderProps extends StylesApiProps, Omit<ComponentPropsWithRef<"span">, "className" | "style" | "children" | "color"> {
  /** Tamanho, o mesmo dos ícones: xs 16, sm 18, md 22, lg 28, xl 32. Padrão: md. */
  size?: Size | undefined;
  /** Papel de cor, ou currentColor para a cor do texto de fora. Padrão: accent. */
  color?: ColorRole | "currentColor" | undefined;
  /** O que o leitor de tela anuncia. Padrão: o texto "Carregando" do provider. false: decorativo (dentro de um botão). */
  label?: string | false | undefined;
}

/** Girador. Para o carregamento de uma tela, a Countify usa Skeleton (blocos cinza), não girador. */
export function Loader(props: LoaderProps) {
  const messages = useMessages();
  const { size = "md", color = "accent", label = messages.loading, className, style, classNames, styles, ...rest } = useComponentProps("Loader", {}, props);
  const getStyles = useStyles("Loader", classes, { className, style, classNames, styles });
  return (
    <span
      {...(label === false ? { "aria-hidden": true } : { role: "status", "aria-label": label })}
      {...rest}
      {...getStyles("root", {
        "--loader-size": `var(--cf-icon-size-${size})`,
        "--loader-color": color === "currentColor" ? "currentColor" : colorVar(color),
      })}
    />
  );
}
