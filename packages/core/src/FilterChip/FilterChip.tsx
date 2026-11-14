import { useComponentProps } from "@countify-oficial/provider";
import type { ElementType, ReactNode } from "react";
import { Icon } from "../Icon/Icon";
import type { PolymorphicProps } from "../polymorphic";
import { useStyles, type StylesApiProps } from "../styles";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";
import classes from "./FilterChip.module.css";

export interface FilterChipOwnProps extends StylesApiProps<"root" | "section" | "label" | "chevron"> {
  /** Há um filtro aplicado, diferente do padrão: tinta e anel do destaque. */
  active?: boolean | undefined;
  /** Ícone antes do texto. */
  leftSection?: ReactNode;
  disabled?: boolean | undefined;
  /** A escolha atual ("Hoje", "Marca · Lume"). */
  children?: ReactNode;
}

export type FilterChipProps<C extends ElementType = "button"> = PolymorphicProps<C, FilterChipOwnProps>;

/**
 * Chip de filtro: o único padrão de filtro do guia. Mostra a escolha e abre a lista de opções; é o alvo de um Menu ou
 * de um Popover (a folha, no celular).
 */
export function FilterChip<C extends ElementType = "button">(props: FilterChipProps<C>) {
  const { component, active, leftSection, disabled, children, className, style, classNames, styles, ...rest } = useComponentProps("FilterChip", {}, props);
  const getStyles = useStyles("FilterChip", classes, { className, style, classNames, styles });
  return (
    <UnstyledButton component={component as ElementType} disabled={disabled} data-active={active || undefined} {...rest} {...getStyles("root")}>
      {leftSection && <span {...getStyles("section")}>{leftSection}</span>}
      <span {...getStyles("label")}>{children}</span>
      <span {...getStyles("chevron")}>
        <Icon name="chevron-down" />
      </span>
    </UnstyledButton>
  );
}
