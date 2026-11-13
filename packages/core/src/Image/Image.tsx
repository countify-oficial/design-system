import { useComponentProps } from "@countify-oficial/provider";
import type { Size } from "@countify-oficial/tokens";
import { useState, type ComponentPropsWithRef, type CSSProperties } from "react";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./Image.module.css";

export interface ImageProps extends StylesApiProps, Omit<ComponentPropsWithRef<"img">, "className" | "style" | "alt"> {
  /** Texto para o leitor de tela; "" se a imagem for só decoração. */
  alt: string;
  /** Canto. Sem ele, reto. */
  radius?: Size | undefined;
  /** object-fit. Padrão: cover. */
  fit?: CSSProperties["objectFit"];
  /** Imagem mostrada se a principal não carregar. */
  fallbackSrc?: string | undefined;
}

/** Imagem com canto da identidade e reserva se não carregar. Dê sempre o alt. */
export function Image(props: ImageProps) {
  const { alt, radius, fit = "cover", fallbackSrc, src, onError, className, style, classNames, styles, ...rest } = useComponentProps("Image", {}, props);
  const getStyles = useStyles("Image", classes, { className, style, classNames, styles });
  const [falhou, setFalhou] = useState<string | undefined>(undefined);
  const usar = fallbackSrc && src !== undefined && falhou === src ? fallbackSrc : src;
  return (
    <img
      {...rest}
      alt={alt}
      src={usar}
      onError={(e) => {
        setFalhou(src);
        onError?.(e);
      }}
      {...getStyles("root", { "--image-radius": radius && `var(--cf-radius-${radius})`, "--image-fit": fit })}
    />
  );
}
