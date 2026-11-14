import { useComponentProps, useMessages } from "@countify-oficial/provider";
import { useId, type ComponentPropsWithRef, type ReactNode } from "react";
import { HelpTip } from "../HelpTip/HelpTip";
import { useStyles, type StylesApiProps } from "../styles";
import { Title } from "../Title/Title";
import classes from "./Section.module.css";

export interface SectionProps
  extends StylesApiProps<"root" | "header" | "heading" | "title" | "aside">, Omit<ComponentPropsWithRef<"section">, "className" | "style" | "title"> {
  /** O título da seção, em 20. */
  title: ReactNode;
  /** Nível do título (h2 a h6). Padrão: 2. */
  order?: 2 | 3 | 4 | 5 | 6 | undefined;
  /** A explicação que o "?" ao lado do título mostra. Sem ela, não há "?". */
  help?: ReactNode;
  /** Nome do "?" para o leitor de tela. Padrão: "Ajuda" do provider e o título, quando o título é texto. */
  helpLabel?: string | undefined;
  /** À direita do título: um número ou texto curto (em 13, texto 2) ou a ação da seção (um Button). */
  aside?: ReactNode;
  /** O conteúdo da seção: campos direto sobre o fundo; lista e tabela, num cartão. */
  children?: ReactNode;
}

/** Seção de uma página: título de 20 com o "?" de ajuda, o que vai à direita e o conteúdo. */
export function Section(props: SectionProps) {
  const { title, order = 2, help, helpLabel, aside, children, className, style, classNames, styles, ...rest } = useComponentProps("Section", {}, props);
  const getStyles = useStyles("Section", classes, { className, style, classNames, styles });
  const messages = useMessages();
  const id = useId();
  const nomeDaAjuda = helpLabel ?? (typeof title === "string" ? `${messages.help}: ${title}` : messages.help);
  return (
    <section aria-labelledby={id} {...rest} {...getStyles("root")}>
      <div {...getStyles("header")}>
        <div {...getStyles("heading")}>
          <Title order={order} size="section" id={id} {...getStyles("title")}>
            {title}
          </Title>
          {help !== undefined && help !== null && help !== false && <HelpTip label={nomeDaAjuda}>{help}</HelpTip>}
        </div>
        {aside !== undefined && aside !== null && aside !== false && <div {...getStyles("aside")}>{aside}</div>}
      </div>
      {children}
    </section>
  );
}
