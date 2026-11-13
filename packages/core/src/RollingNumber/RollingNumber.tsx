import { formatNumber, useComponentProps, useCountifyTheme, type FormatNumberOptions } from "@countify-oficial/provider";
import type { ComponentPropsWithRef } from "react";
import { useStyles, type StylesApiProps } from "../styles";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden";
import classes from "./RollingNumber.module.css";

export interface RollingNumberProps
  extends FormatNumberOptions, StylesApiProps<"root" | "column" | "strip">, Omit<ComponentPropsWithRef<"span">, "className" | "style" | "children"> {
  value: number;
  /** Duração da rolagem: fast, base ou slow. Padrão: slow. */
  duration?: "fast" | "base" | "slow" | undefined;
}

const DIGITOS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

/** Número que rola os algarismos quando muda (um contador ao vivo). O leitor de tela lê o número inteiro. */
export function RollingNumber(props: RollingNumberProps) {
  const { locale: doProvider } = useCountifyTheme();
  const { value, duration = "slow", locale = doProvider, decimalScale, fixedDecimalScale, format, className, style, classNames, styles, ...rest } =
    useComponentProps("RollingNumber", {}, props);
  const getStyles = useStyles("RollingNumber", classes, { className, style, classNames, styles });
  const texto = formatNumber(value, { locale, decimalScale, fixedDecimalScale, format });
  const letras = Array.from(texto);
  return (
    <span {...rest} {...getStyles("root", { "--rolling-duration": `var(--cf-duration-${duration})` })}>
      <VisuallyHidden>{texto}</VisuallyHidden>
      <span aria-hidden style={{ display: "contents" }}>
        {letras.map((l, i) => {
          // a chave conta da direita: as unidades continuam na mesma coluna quando o número cresce
          const chave = letras.length - i;
          return DIGITOS.includes(l) ? (
            <span key={chave} {...getStyles("column")}>
              <span {...getStyles("strip", { "--digit": Number(l) })}>{DIGITOS.map((d) => <span key={d}>{d}</span>)}</span>
            </span>
          ) : (
            <span key={chave}>{l}</span>
          );
        })}
      </span>
    </span>
  );
}
