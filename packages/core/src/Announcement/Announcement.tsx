import { useId } from "@countify-oficial/hooks";
import { useComponentProps, useMessages } from "@countify-oficial/provider";
import type { Tone } from "@countify-oficial/tokens";
import { useState, type ElementType, type MouseEvent, type ReactNode } from "react";
import { CloseButton } from "../CloseButton/CloseButton";
import { tabbables } from "../FocusTrap/FocusTrap";
import { Icon } from "../Icon/Icon";
import type { PolymorphicProps } from "../polymorphic";
import { ThemeIcon } from "../ThemeIcon/ThemeIcon";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./Announcement.module.css";

export interface AnnouncementOwnProps extends StylesApiProps<"root" | "icon" | "body" | "title" | "message" | "action" | "closeButton"> {
  /** Título, em 17 ("Nova versão do agente"). Também dá nome à região. */
  title: ReactNode;
  /** Ícone dentro do quadrado do tom (ThemeIcon). Padrão: o sino (bell); null tira. */
  icon?: ReactNode;
  /** Tom do quadrado do ícone: accent, up, warn, down ou gray. Padrão: accent. */
  color?: Tone | undefined;
  /** Ação opcional, abaixo do texto: um Button size="sm" ou um Anchor ("Ver o que mudou"). */
  action?: ReactNode;
  /** Controlado: mostra (true) ou esconde (false). Com ele, quem esconde depois de dispensar é o app, no onDismiss. */
  opened?: boolean | undefined;
  /** Não controlado: começa aberto? Padrão: true. */
  defaultOpened?: boolean | undefined;
  /** Chamado ao tocar no ×. */
  onDismiss?: (() => void) | undefined;
  /**
   * Lembra a dispensa no localStorage com esta chave (o valor gravado é "1"): no modo não controlado, o anúncio já
   * dispensado não volta. Use uma chave por novidade ("novidade-csv-2026-11"). Sem localStorage (modo privado,
   * bloqueado), funciona como se não houvesse chave.
   */
  storageKey?: string | undefined;
  /** Nome do botão ×. Padrão: "Dispensar" do provider. */
  dismissLabel?: string | undefined;
  /** O texto curto, em 15 e na cor de texto 2. */
  children?: ReactNode;
}

export type AnnouncementProps<C extends ElementType = "div"> = PolymorphicProps<C, AnnouncementOwnProps>;

const LEMBRADO = "1";

function lembrado(chave: string | undefined): boolean {
  if (!chave) return false;
  try {
    return window.localStorage.getItem(chave) === LEMBRADO;
  } catch {
    return false; // sem window (servidor) ou localStorage bloqueado
  }
}

function lembrar(chave: string | undefined) {
  if (!chave) return;
  try {
    window.localStorage.setItem(chave, LEMBRADO);
  } catch {
    // localStorage cheio ou bloqueado: a dispensa vale só até recarregar
  }
}

/**
 * Novidade que fica na tela até ser dispensada ("Agora dá para exportar em CSV"): no rodapé do menu lateral ou no
 * topo de uma tela. Não é o Alert (erro ou aviso do conteúdo) nem o Notification (some sozinho).
 * É uma região com o nome do título. Ao dispensar com o foco dentro dele, o foco vai para o próximo elemento focável
 * da página (ou o anterior, se ele era o último), para o teclado não cair no começo da página.
 */
export function Announcement<C extends ElementType = "div">(props: AnnouncementProps<C>) {
  const {
    component, title, icon, color = "accent", action, opened, defaultOpened = true, onDismiss, storageKey, dismissLabel, children,
    className, style, classNames, styles, ...rest
  } = useComponentProps("Announcement", {}, props);
  const getStyles = useStyles("Announcement", classes, { className, style, classNames, styles });
  const messages = useMessages();
  const tituloId = useId();
  const [aberto, setAberto] = useState(() => defaultOpened && !lembrado(storageKey));
  if (!(opened ?? aberto)) return null;

  const dispensar = (e: MouseEvent<HTMLElement>) => {
    const raiz = e.currentTarget.parentElement; // o × é filho direto da raiz
    if (raiz?.contains(document.activeElement)) {
      const focaveis = tabbables(raiz.ownerDocument.body).filter((el) => !raiz.contains(el));
      const depois = focaveis.find((el) => raiz.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING);
      (depois ?? focaveis.at(-1))?.focus();
    }
    lembrar(storageKey);
    setAberto(false);
    onDismiss?.();
  };

  const Component: ElementType = component ?? "div";
  return (
    <Component role="region" aria-labelledby={tituloId} {...rest} data-color={color} {...getStyles("root")}>
      {icon !== null && <ThemeIcon color={color} {...getStyles("icon")}>{icon ?? <Icon name="bell" />}</ThemeIcon>}
      <div {...getStyles("body")}>
        <div id={tituloId} {...getStyles("title")}>{title}</div>
        {children !== undefined && <div {...getStyles("message")}>{children}</div>}
        {action !== undefined && <div {...getStyles("action")}>{action}</div>}
      </div>
      <CloseButton aria-label={dismissLabel ?? messages.dismiss} onClick={dispensar} color="text2" {...getStyles("closeButton")} />
    </Component>
  );
}
