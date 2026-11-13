import { useComponentProps } from "@countify-oficial/provider";
import type { ElementType, SyntheticEvent } from "react";
import type { PolymorphicProps } from "../polymorphic";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./UnstyledButton.module.css";

export interface UnstyledButtonOwnProps extends StylesApiProps {
  /** Desliga o botão. No `<button>`, vira `disabled`; nos outros elementos, `aria-disabled` e o clique não faz nada. */
  disabled?: boolean | undefined;
}

export type UnstyledButtonProps<C extends ElementType = "button"> = PolymorphicProps<C, UnstyledButtonOwnProps>;

const bloquear = (e: SyntheticEvent) => e.preventDefault();

/** Botão sem aparência: zera o estilo do navegador e mantém o foco visível. Base dos outros botões. */
export function UnstyledButton<C extends ElementType = "button">(props: UnstyledButtonProps<C>) {
  const { component, disabled, className, style, classNames, styles, ...rest } = useComponentProps("UnstyledButton", {}, props);
  const getStyles = useStyles("UnstyledButton", classes, { className, style, classNames, styles });
  const Component: ElementType = component ?? "button";
  const nativo = Component === "button";
  return (
    <Component
      {...(nativo ? { type: "button", disabled } : { "aria-disabled": disabled || undefined })}
      {...rest}
      {...(!nativo && disabled && { onClick: bloquear })}
      data-disabled={disabled || undefined}
      {...getStyles("root")}
    />
  );
}
