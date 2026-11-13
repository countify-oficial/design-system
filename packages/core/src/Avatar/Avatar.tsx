import { useComponentProps } from "@countify-oficial/provider";
import type { Size, Tone } from "@countify-oficial/tokens";
import { useState, type ElementType, type ReactNode } from "react";
import { Icon } from "../Icon/Icon";
import type { PolymorphicProps } from "../polymorphic";
import { toneVars, useStyles, type StylesApiProps } from "../styles";
import classes from "./Avatar.module.css";

export interface AvatarOwnProps extends StylesApiProps<"root" | "image"> {
  /** Foto. Se não carregar, mostra as iniciais. */
  src?: string | undefined;
  /** Nome da pessoa: vira as iniciais e o nome para o leitor de tela. */
  name?: string | undefined;
  /** Lado: xs 24, sm 32, md 40, lg 48, xl 64. Padrão: md. */
  size?: Size | undefined;
  /** Tom das iniciais. Padrão: accent. */
  color?: Tone | undefined;
  /** Conteúdo próprio no lugar das iniciais. */
  children?: ReactNode;
}

export type AvatarProps<C extends ElementType = "span"> = PolymorphicProps<C, AvatarOwnProps>;

/** "Ana Souza" → "AS"; um nome só → as duas primeiras letras. */
export function initials(name: string): string {
  const partes = name.trim().split(/\s+/).filter(Boolean);
  const [primeira = "", ultima] = [partes[0], partes.length > 1 ? partes.at(-1) : undefined];
  return (ultima ? (primeira[0] ?? "") + (ultima[0] ?? "") : primeira.slice(0, 2)).toUpperCase();
}

const letra: Record<Size, string> = { xs: "xs", sm: "xs", md: "sm", lg: "sm", xl: "lg" };

/** Foto ou iniciais da pessoa, num círculo. */
export function Avatar<C extends ElementType = "span">(props: AvatarProps<C>) {
  const { component, src, name, size = "md", color = "accent", children, className, style, classNames, styles, ...rest } =
    useComponentProps("Avatar", {}, props);
  const getStyles = useStyles("Avatar", classes, { className, style, classNames, styles });
  const [falhou, setFalhou] = useState<string | undefined>(undefined);
  const Component: ElementType = component ?? "span";
  const foto = src !== undefined && falhou !== src;
  return (
    <Component
      {...(foto ? {} : { role: "img", "aria-label": name })}
      {...rest}
      {...getStyles("root", { ...toneVars(color), "--avatar-size": `var(--cf-avatar-size-${size})`, "--avatar-fz": `var(--cf-font-size-${letra[size]})` })}
    >
      {foto ? (
        <img src={src} alt={name ?? ""} onError={() => setFalhou(src)} {...getStyles("image")} />
      ) : (
        (children ?? (name ? <span aria-hidden>{initials(name)}</span> : <Icon name="person" size={size === "xl" ? "lg" : "sm"} />))
      )}
    </Component>
  );
}
