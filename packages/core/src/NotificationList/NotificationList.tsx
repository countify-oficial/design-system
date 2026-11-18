import { useControllableState, useId } from "@countify-oficial/hooks";
import { groupByDay, useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { useState, type ComponentPropsWithRef, type KeyboardEvent, type ReactNode } from "react";
import { EmptyState } from "../EmptyState/EmptyState";
import { NavLink } from "../NavLink/NavLink";
import { SkeletonLoader } from "../SkeletonLoader/SkeletonLoader";
import { useStyles, type StylesApiProps } from "../styles";
import { Title } from "../Title/Title";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden";
import classes from "./NotificationList.module.css";

/** Um aviso da lista. */
export interface NotificationListItem {
  /** Identificador único: é o que `selected` e `onSelect` usam. */
  id: string;
  /** O título ("Câmera 2 sem imagem", "Ana Souza"). */
  title: ReactNode;
  /** A linha de baixo, em texto 2 (a loja). */
  description?: ReactNode;
  /** Quando aconteceu (Date, texto ISO ou milissegundos): agrupa por dia e mostra a hora. */
  date: Date | string | number;
  /** Antes do texto: um ThemeIcon (aviso do sistema) ou um Avatar (pessoa). Decorativo para o leitor de tela. */
  icon?: ReactNode;
  /** Ainda não lido: título em negrito e um ponto de destaque ao lado da hora. */
  unread?: boolean | undefined;
}

export interface NotificationListProps
  extends StylesApiProps<"root" | "group" | "groupLabel" | "list" | "item" | "icon" | "time" | "dot">,
    Omit<ComponentPropsWithRef<"div">, "className" | "style" | "onSelect" | "children"> {
  /** Os avisos, do mais novo ao mais antigo: a lista agrupa por dia na ordem em que chegam (Hoje, Ontem, 12 de novembro). */
  items: NotificationListItem[];
  /** O aviso escolhido, cujo detalhe o app mostra ao lado (controlado). Fica com o fundo de destaque e aria-current. */
  selected?: string | null | undefined;
  /** O aviso escolhido no começo (não controlado). */
  defaultSelected?: string | null | undefined;
  /** Clique, Enter ou espaço num aviso. */
  onSelect?: ((id: string, item: NotificationListItem) => void) | undefined;
  /** Mostra linhas cinza no lugar da lista (SkeletonLoader). */
  loading?: boolean | undefined;
  /** O que mostrar sem avisos. Padrão: EmptyState com "Nenhum aviso" do provider. */
  emptyState?: ReactNode;
}

/**
 * A lista dos Avisos (mockup W-Avisos): avisos agrupados por dia, cada um uma linha de 64 com ícone ou iniciais,
 * título, loja e hora; o escolhido fica destacado. Uma parada no Tab: as setas, Home e End andam entre os avisos.
 * Os filtros (Todos · Pessoas · Sistema) e o detalhe são do app.
 */
export function NotificationList(props: NotificationListProps) {
  const { messages, locale } = useCountifyTheme();
  const { items, selected, defaultSelected, onSelect, loading, emptyState, className, style, classNames, styles, ...rest } =
    useComponentProps("NotificationList", {}, props);
  const getStyles = useStyles("NotificationList", classes, { className, style, classNames, styles });
  const base = useId();
  const [escolhido, setEscolhido] = useControllableState<string | null>({ value: selected, defaultValue: defaultSelected ?? null });
  const [foco, setFoco] = useState<string | null>(null);

  if (loading) return <SkeletonLoader variant="list" {...rest} {...getStyles("root")} />;
  if (items.length === 0) return <div {...rest} {...getStyles("root")}>{emptyState ?? <EmptyState title={messages.noNotifications} />}</div>;

  const grupos = groupByDay(items, (a) => new Date(a.date), { locale, today: messages.today, yesterday: messages.yesterday });
  const ids = grupos.flatMap((g) => g.items.map((a) => a.id));
  // a parada do Tab: o último focado, senão o escolhido, senão o primeiro
  const atual = [foco, escolhido].find((v) => v !== null && ids.includes(v)) ?? ids[0];

  // cada aviso tem o id `${base}-i-<posição>`: as setas focam pela posição
  const aoTeclar = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const destino = { ArrowDown: Math.min(i + 1, ids.length - 1), ArrowUp: Math.max(i - 1, 0), Home: 0, End: ids.length - 1 }[e.key];
    if (destino === undefined) return;
    e.preventDefault();
    e.currentTarget.ownerDocument.getElementById(`${base}-i-${destino}`)?.focus();
  };

  return (
    <div {...rest} {...getStyles("root")}>
      {grupos.map((g) => (
        <div key={g.key} {...getStyles("group")}>
          <Title order={2} size="overline" id={`${base}-${g.key}`} {...getStyles("groupLabel")}>{g.label}</Title>
          <ul aria-labelledby={`${base}-${g.key}`} {...getStyles("list")}>
            {g.items.map((item) => {
              const d = new Date(item.date);
              return (
                <li key={item.id}>
                  <NavLink
                    component="button"
                    type="button"
                    id={`${base}-i-${ids.indexOf(item.id)}`}
                    data-unread={item.unread || undefined}
                    tabIndex={item.id === atual ? 0 : -1}
                    onFocus={() => setFoco(item.id)}
                    onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => aoTeclar(e, ids.indexOf(item.id))}
                    active={item.id === escolhido}
                    aria-current={item.id === escolhido ? "true" : undefined}
                    onClick={() => {
                      setEscolhido(item.id);
                      onSelect?.(item.id, item);
                    }}
                    leftSection={item.icon === undefined ? undefined : <span aria-hidden {...getStyles("icon")}>{item.icon}</span>}
                    label={item.title}
                    {...(item.unread ? { classNames: { label: classes["unread"] ?? "" } } : {})}
                    description={item.description}
                    rightSection={
                      <>
                        <time dateTime={Number.isNaN(d.getTime()) ? undefined : d.toISOString()} {...getStyles("time")}>{d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}</time>
                        {item.unread && <span aria-hidden {...getStyles("dot")} />}
                        {item.unread && <VisuallyHidden>{messages.unread}</VisuallyHidden>}
                      </>
                    }
                    {...getStyles("item")}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
