import { useComponentProps } from "@countify-oficial/provider";
import type { Responsive, Size } from "@countify-oficial/tokens";
import type { ElementType, ReactNode } from "react";
import { Loader } from "../Loader/Loader";
import type { PolymorphicProps } from "../polymorphic";
import { responsiveVars, useStyles, type StylesApiProps } from "../styles";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";
import classes from "./Button.module.css";

/** filled: principal (um por tela); outline: Cancelar; subtle: só texto (Excluir, com color="down"); dashed: adicionar. */
export type ButtonVariant = "filled" | "outline" | "subtle" | "dashed";
/** accent: o azul do botão; down, up e warn: as cores de queda, alta e aviso. */
export type ButtonColor = "accent" | "down" | "up" | "warn";

export interface ButtonOwnProps extends StylesApiProps<"root" | "label" | "section" | "loader"> {
  /** Padrão: filled. */
  variant?: ButtonVariant | undefined;
  /** Padrão: accent. */
  color?: ButtonColor | undefined;
  /** Altura, recuo e letra: xs/sm 44, md 52, lg 56, xl 64. Por ponto de quebra; padrão: md no celular e sm a partir de 768. */
  size?: Responsive<Size> | undefined;
  /** Canto: xs 8, sm 12, md 16, lg 20, xl 24. Padrão: sm. */
  radius?: Size | undefined;
  /** Ocupa a largura toda. */
  fullWidth?: boolean | undefined;
  disabled?: boolean | undefined;
  /** Mostra o girador no lugar do ícone da esquerda e desliga o botão (aria-busy). */
  loading?: boolean | undefined;
  /** Antes do texto (um Icon, por exemplo). */
  leftSection?: ReactNode;
  /** Depois do texto. */
  rightSection?: ReactNode;
  children?: ReactNode;
}

export type ButtonProps<C extends ElementType = "button"> = PolymorphicProps<C, ButtonOwnProps>;

const padrao: Responsive<Size> = { base: "md", sm: "sm" };

/** Botão da Countify. Um <button>, ou o elemento de `component` (um link, por exemplo). */
export function Button<C extends ElementType = "button">(props: ButtonProps<C>) {
  const {
    component, variant = "filled", color = "accent", size = padrao, radius = "sm", fullWidth, disabled, loading,
    leftSection, rightSection, children, className, style, classNames, styles, ...rest
  } = useComponentProps("Button", {}, props);
  const getStyles = useStyles("Button", classes, { className, style, classNames, styles });
  return (
    <UnstyledButton
      component={component as ElementType}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      data-variant={variant}
      data-color={color}
      data-full-width={fullWidth || undefined}
      data-loading={loading || undefined}
      {...rest}
      {...getStyles("root", {
        ...responsiveVars("--button-height", size, (s) => `var(--cf-button-height-${s})`),
        ...responsiveVars("--button-px", size, (s) => `var(--cf-control-padding-x-${s})`),
        ...responsiveVars("--button-fz", size, (s) => `var(--cf-control-font-size-${s})`),
        "--button-radius": `var(--cf-radius-${radius})`,
      })}
    >
      {loading ? (
        <Loader size="sm" color="currentColor" label={false} {...getStyles("loader")} />
      ) : (
        leftSection && <span {...getStyles("section")}>{leftSection}</span>
      )}
      <span {...getStyles("label")}>{children}</span>
      {rightSection && <span {...getStyles("section")}>{rightSection}</span>}
    </UnstyledButton>
  );
}
