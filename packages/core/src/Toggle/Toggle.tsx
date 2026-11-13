import { useControllableState } from "@countify-oficial/hooks";
import { useComponentProps } from "@countify-oficial/provider";
import type { Size } from "@countify-oficial/tokens";
import type { ElementType, MouseEvent, ReactNode } from "react";
import type { PolymorphicProps } from "../polymorphic";
import { useStyles, type StylesApiProps } from "../styles";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";
import classes from "./Toggle.module.css";

export interface ToggleOwnProps extends StylesApiProps {
  /** Ligado (controlado). */
  pressed?: boolean | undefined;
  /** Ligado no início (não controlado). */
  defaultPressed?: boolean | undefined;
  /** Chamado com o novo estado a cada clique. */
  onPressedChange?: ((pressed: boolean) => void) | undefined;
  /** Canto: xs 8, sm 12, md 16, lg 20, xl 24. Padrão: sm. */
  radius?: Size | undefined;
  disabled?: boolean | undefined;
  onClick?: ((e: MouseEvent<HTMLButtonElement>) => void) | undefined;
  children?: ReactNode;
}

export type ToggleProps<C extends ElementType = "button"> = PolymorphicProps<C, ToggleOwnProps>;

/** Botão que liga e desliga (aria-pressed), com o visual dos chips de escolha da Countify. */
export function Toggle<C extends ElementType = "button">(props: ToggleProps<C>) {
  const {
    component, pressed, defaultPressed, onPressedChange, radius = "sm", disabled, onClick,
    className, style, classNames, styles, ...rest
  } = useComponentProps("Toggle", {}, props);
  const getStyles = useStyles("Toggle", classes, { className, style, classNames, styles });
  const [ligado, setLigado] = useControllableState({ value: pressed, defaultValue: defaultPressed ?? false, onChange: onPressedChange });
  return (
    <UnstyledButton
      component={component as ElementType}
      disabled={disabled}
      aria-pressed={ligado}
      data-pressed={ligado || undefined}
      onClick={(e: MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        if (!e.defaultPrevented) setLigado(!ligado);
      }}
      {...rest}
      {...getStyles("root", { "--toggle-radius": `var(--cf-radius-${radius})` })}
    />
  );
}
