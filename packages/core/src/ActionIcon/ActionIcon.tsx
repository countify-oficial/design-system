import { useComponentProps } from "@countify-oficial/provider";
import type { ColorRole, Size } from "@countify-oficial/tokens";
import type { ElementType, ReactNode } from "react";
import { Loader } from "../Loader/Loader";
import type { PolymorphicProps } from "../polymorphic";
import { kebab, useStyles, type StylesApiProps } from "../styles";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";
import classes from "./ActionIcon.module.css";

/** subtle: sem fundo (Voltar); default: cartão com anel (Editar); filled: fundo de chip. */
export type ActionIconVariant = "subtle" | "default" | "filled";

export interface ActionIconOwnProps extends StylesApiProps {
  /** O nome para o leitor de tela: o ícone sozinho não diz nada. */
  "aria-label": string;
  /** Padrão: subtle. */
  variant?: ActionIconVariant | undefined;
  /** Papel de cor do ícone. Padrão: text. */
  color?: ColorRole | undefined;
  /** Lado do quadrado: xs/sm 44, md 52, lg 56, xl 64. Padrão: sm (44, o alvo de toque). */
  size?: Size | undefined;
  /** Canto: xs 8, sm 12, md 16, lg 20, xl 24. Padrão: sm. */
  radius?: Size | undefined;
  disabled?: boolean | undefined;
  /** Girador no lugar do ícone; desliga o botão. */
  loading?: boolean | undefined;
  /** O ícone. */
  children?: ReactNode;
}

export type ActionIconProps<C extends ElementType = "button"> = PolymorphicProps<C, ActionIconOwnProps>;

/** Botão só com ícone, com nome para o leitor de tela. */
export function ActionIcon<C extends ElementType = "button">(props: ActionIconProps<C>) {
  const {
    component, variant = "subtle", color = "text", size = "sm", radius = "sm", disabled, loading, children,
    className, style, classNames, styles, ...rest
  } = useComponentProps("ActionIcon", {}, props);
  const getStyles = useStyles("ActionIcon", classes, { className, style, classNames, styles });
  return (
    <UnstyledButton
      component={component as ElementType}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      data-variant={variant}
      data-loading={loading || undefined}
      {...rest}
      {...getStyles("root", {
        "--ai-size": `var(--cf-button-height-${size})`,
        "--ai-radius": `var(--cf-radius-${radius})`,
        "--ai-color": `var(--cf-color-${kebab(color)})`,
      })}
    >
      {loading ? <Loader size="sm" color="currentColor" label={false} /> : children}
    </UnstyledButton>
  );
}
