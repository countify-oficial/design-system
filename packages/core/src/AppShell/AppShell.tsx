import { useComponentProps, useMessages } from "@countify-oficial/provider";
import type { IconName } from "@countify-oficial/tokens";
import { createContext, useContext, type ComponentPropsWithRef, type ElementType, type ReactNode } from "react";
import { Icon } from "../Icon/Icon";
import type { PolymorphicProps } from "../polymorphic";
import { useStyles, type StylesApiProps } from "../styles";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden";
import classes from "./AppShell.module.css";

const Lugar = createContext<"header" | "tabs">("tabs");

export type AppShellProps = StylesApiProps & Omit<ComponentPropsWithRef<"div">, "className" | "style">;

/** A moldura do app: AppShell.Header (computador), AppShell.Main e AppShell.TabBar (celular). */
function AppShellRoot(props: AppShellProps) {
  const { className, style, classNames, styles, ...rest } = useComponentProps("AppShell", {}, props);
  const getStyles = useStyles("AppShell", classes, { className, style, classNames, styles });
  return <div {...rest} {...getStyles("root")} />;
}

export interface AppShellHeaderProps extends StylesApiProps<"header" | "logo" | "menu" | "end">, Omit<ComponentPropsWithRef<"header">, "className" | "style"> {
  /** A marca, à esquerda. */
  logo?: ReactNode;
  /** À direita: o seletor de conta e o avatar. */
  end?: ReactNode;
  /** Os AppShell.NavItem do menu. */
  children?: ReactNode;
}

/** Cabeçalho de 64 do computador (a partir de 768): marca, menu e, à direita, conta e usuário. */
export function AppShellHeader(props: AppShellHeaderProps) {
  const messages = useMessages();
  const { logo, end, children, className, style, classNames, styles, ...rest } = useComponentProps("AppShellHeader", {}, props);
  const getStyles = useStyles("AppShell", classes, { className, style, classNames, styles });
  return (
    <header {...rest} {...getStyles("header")}>
      {logo !== undefined && <div {...getStyles("logo")}>{logo}</div>}
      <nav aria-label={messages.sections}>
        <ul {...getStyles("menu")}>
          <Lugar value="header">{children}</Lugar>
        </ul>
      </nav>
      {end !== undefined && <div {...getStyles("end")}>{end}</div>}
    </header>
  );
}

export type AppShellMainProps = StylesApiProps<"main"> & Omit<ComponentPropsWithRef<"main">, "className" | "style">;

/** O conteúdo da tela, com as margens de 20 (celular) e 32 (computador) e espaço para as abas embaixo. */
export function AppShellMain(props: AppShellMainProps) {
  const { className, style, classNames, styles, ...rest } = useComponentProps("AppShellMain", {}, props);
  const getStyles = useStyles("AppShell", classes, { className, style, classNames, styles });
  return <main {...rest} {...getStyles("main")} />;
}

export interface AppShellTabBarProps extends StylesApiProps<"tabBar" | "tabs">, Omit<ComponentPropsWithRef<"nav">, "className" | "style"> {
  /** Os AppShell.NavItem (a identidade usa quatro). */
  children?: ReactNode;
}

/** Abas embaixo, no celular (abaixo de 768). */
export function AppShellTabBar(props: AppShellTabBarProps) {
  const messages = useMessages();
  const { children, className, style, classNames, styles, ...rest } = useComponentProps("AppShellTabBar", {}, props);
  const getStyles = useStyles("AppShell", classes, { className, style, classNames, styles });
  return (
    <nav aria-label={messages.sections} {...rest} {...getStyles("tabBar")}>
      <ul {...getStyles("tabs")}>
        <Lugar value="tabs">{children}</Lugar>
      </ul>
    </nav>
  );
}

export interface AppShellNavItemOwnProps extends StylesApiProps<"item" | "label"> {
  icon: IconName;
  label: string;
  /** A seção atual (fica ativa também nas subtelas dela). */
  active?: boolean | undefined;
  /** Contagem depois do nome, no cabeçalho (um Badge). As abas do celular não mostram. */
  badge?: ReactNode;
}

export type AppShellNavItemProps<C extends ElementType = "a"> = PolymorphicProps<C, AppShellNavItemOwnProps>;

/** Um item do menu: pílula com ícone e nome no cabeçalho; ícone sobre o nome nas abas. */
export function AppShellNavItem<C extends ElementType = "a">(props: AppShellNavItemProps<C>) {
  const lugar = useContext(Lugar);
  const { component, icon, label, active, badge, className, style, classNames, styles, ...rest } = useComponentProps("AppShellNavItem", {}, props);
  const getStyles = useStyles("AppShell", classes, { className, style, classNames, styles });
  const Componente: ElementType = component ?? "a";
  return (
    <li>
      <Componente aria-current={active ? "page" : undefined} data-place={lugar} {...rest} {...getStyles("item")}>
        <Icon name={icon} />
        {/* o nome some da tela entre 768 e 1279 (só ícones), mas fica para o leitor de tela */}
        <VisuallyHidden>{label}</VisuallyHidden>
        <span aria-hidden {...getStyles("label")}>{label}</span>
        {lugar === "header" && badge}
      </Componente>
    </li>
  );
}

/** AppShell com Header, Main, TabBar e NavItem. */
export const AppShell = Object.assign(AppShellRoot, { Header: AppShellHeader, Main: AppShellMain, TabBar: AppShellTabBar, NavItem: AppShellNavItem });
