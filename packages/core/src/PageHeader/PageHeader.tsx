import { useComponentProps, useMessages } from "@countify-oficial/provider";
import type { ComponentPropsWithRef, ElementType, MouseEventHandler, ReactNode } from "react";
import { Icon } from "../Icon/Icon";
import { useStyles, type StylesApiProps } from "../styles";
import { Title } from "../Title/Title";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";
import classes from "./PageHeader.module.css";

export interface PageHeaderProps
  extends StylesApiProps<"root" | "back" | "backLabel" | "title" | "actions">, Omit<ComponentPropsWithRef<"header">, "className" | "style" | "title"> {
  /** O título da página (h1): 22 no celular e 28 a partir de 768. */
  title: ReactNode;
  /** Nome da tela de origem, no link de voltar do computador ("Ajustes"). No celular aparece só a seta. Padrão: "Voltar" do provider. */
  backLabel?: string | undefined;
  /** Destino do voltar, quando ele é um link. */
  backHref?: string | undefined;
  /** Clique no voltar. O voltar só aparece com backHref ou onBack. */
  onBack?: MouseEventHandler<HTMLElement> | undefined;
  /** As ações da página, à direita (Button no computador, ActionIcon no celular). */
  children?: ReactNode;
}

/**
 * Cabeçalho de página: o título e as ações à direita. No computador, o voltar é um link acima do título, com o nome
 * da tela de origem; no celular, a seta redonda antes do título.
 */
export function PageHeader(props: PageHeaderProps) {
  const messages = useMessages();
  const { title, backLabel, backHref, onBack, children, className, style, classNames, styles, ...rest } = useComponentProps("PageHeader", {}, props);
  const getStyles = useStyles("PageHeader", classes, { className, style, classNames, styles });
  const comVoltar = backHref !== undefined || onBack !== undefined;
  const nomeDoVoltar = backLabel ?? messages.back;
  return (
    <header data-with-back={comVoltar || undefined} {...rest} {...getStyles("root")}>
      {comVoltar && (
        <UnstyledButton component={(backHref !== undefined ? "a" : "button") as ElementType} href={backHref} aria-label={nomeDoVoltar} onClick={onBack} {...getStyles("back")}>
          <Icon name="back" />
          <span {...getStyles("backLabel")}>{nomeDoVoltar}</span>
        </UnstyledButton>
      )}
      <Title order={1} {...getStyles("title")}>
        {title}
      </Title>
      {children !== undefined && children !== null && children !== false && <div {...getStyles("actions")}>{children}</div>}
    </header>
  );
}
