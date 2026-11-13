import { useControllableState } from "@countify-oficial/hooks";
import { useComponentProps } from "@countify-oficial/provider";
import type { ElementType, ReactNode } from "react";
import { Collapse } from "../Collapse/Collapse";
import { Icon } from "../Icon/Icon";
import type { PolymorphicProps } from "../polymorphic";
import { useStyles, type StylesApiProps } from "../styles";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";
import classes from "./NavLink.module.css";

export interface NavLinkOwnProps extends StylesApiProps<"root" | "section" | "body" | "label" | "description" | "chevron" | "children"> {
  label: ReactNode;
  description?: ReactNode;
  /** Antes do texto: um ThemeIcon (o quadro de 40 do mockup) ou um Avatar. */
  leftSection?: ReactNode;
  /** Depois do texto: um valor, um Badge ou a seta (Icon chevron-right). */
  rightSection?: ReactNode;
  /** A tela atual (fundo da tinta e aria-current). */
  active?: boolean | undefined;
  disabled?: boolean | undefined;
  /** Com filhos, a linha abre e fecha a lista de baixo (controlado). */
  opened?: boolean | undefined;
  defaultOpened?: boolean | undefined;
  onChange?: ((opened: boolean) => void) | undefined;
  /** NavLinks de baixo; a linha vira um botão que abre e fecha. */
  children?: ReactNode;
}

export type NavLinkProps<C extends ElementType = "a"> = PolymorphicProps<C, NavLinkOwnProps>;

/** Linha de navegação de 64: ícone, título, descrição e o que vai à direita. Com filhos, abre um nível abaixo. */
export function NavLink<C extends ElementType = "a">(props: NavLinkProps<C>) {
  const {
    component, label, description, leftSection, rightSection, active, disabled, opened, defaultOpened, onChange, children, onClick,
    className, style, classNames, styles, ...rest
  } = useComponentProps("NavLink", {}, props);
  const getStyles = useStyles("NavLink", classes, { className, style, classNames, styles });
  const [aberto, setAberto] = useControllableState({ value: opened, defaultValue: defaultOpened ?? false, onChange });
  const temFilhos = children !== undefined && children !== null && children !== false;
  const conteudo = (
    <>
      {leftSection !== undefined && <span {...getStyles("section")}>{leftSection}</span>}
      <span {...getStyles("body")}>
        <span {...getStyles("label")}>{label}</span>
        {description !== undefined && <span {...getStyles("description")}>{description}</span>}
      </span>
      {(rightSection !== undefined || temFilhos) && (
        <span data-position="right" {...getStyles("section")}>
          {rightSection}
          {temFilhos && <span {...getStyles("chevron")}><Icon name="chevron-right" size="xs" /></span>}
        </span>
      )}
    </>
  );
  const estado = { "data-active": active || undefined, "data-disabled": disabled || undefined };
  if (temFilhos) {
    return (
      <>
        <UnstyledButton
          aria-expanded={aberto}
          disabled={disabled}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            (onClick as ((e: React.MouseEvent<HTMLButtonElement>) => void) | undefined)?.(e);
            setAberto(!aberto);
          }}
          {...estado}
          {...getStyles("root")}
        >
          {conteudo}
        </UnstyledButton>
        <Collapse in={aberto}>
          <div {...getStyles("children")}>{children}</div>
        </Collapse>
      </>
    );
  }
  const Componente: ElementType = component ?? "a";
  return (
    <Componente
      aria-current={active ? "page" : undefined}
      aria-disabled={disabled || undefined}
      onClick={disabled ? (e: React.MouseEvent) => e.preventDefault() : onClick}
      {...rest}
      {...estado}
      {...getStyles("root")}
    >
      {conteudo}
    </Componente>
  );
}
