import { useControllableState } from "@countify-oficial/hooks";
import { useComponentProps, useMessages } from "@countify-oficial/provider";
import { useEffect, type ComponentPropsWithRef, type ReactNode } from "react";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./TableOfContents.module.css";

export interface TableOfContentsLink {
  /** O id do título na página (o link vai para #id). */
  id: string;
  label: ReactNode;
  /** Recuo: 0 para seção, 1 para subseção… Padrão: 0. */
  depth?: number | undefined;
}

export interface TableOfContentsProps extends StylesApiProps<"root" | "list" | "link" | "number">, Omit<ComponentPropsWithRef<"nav">, "className" | "style" | "onChange"> {
  links: TableOfContentsLink[];
  /** A seção atual (controlado). Sem ele, segue a rolagem da página. */
  active?: string | null | undefined;
  onChange?: ((id: string | null) => void) | undefined;
  /** Números "01", "02"… antes do rótulo, como no índice da identidade. Padrão: true. */
  withNumbers?: boolean | undefined;
}

/** Índice da página: um link por título; o da seção que está na tela fica marcado. */
export function TableOfContents(props: TableOfContentsProps) {
  const messages = useMessages();
  const { links, active, onChange, withNumbers = true, className, style, classNames, styles, ...rest } = useComponentProps("TableOfContents", {}, props);
  const getStyles = useStyles("TableOfContents", classes, { className, style, classNames, styles });
  const [atual, setAtual] = useControllableState<string | null>({ value: active, defaultValue: null, onChange });
  const ids = links.map((l) => l.id).join("\n");
  const seguir = active === undefined;
  // a seção atual é o primeiro título visível no alto da tela
  useEffect(() => {
    if (!seguir || typeof IntersectionObserver === "undefined") return;
    const lista = ids.split("\n");
    const visiveis = new Set<string>();
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) visiveis.add(e.target.id);
          else visiveis.delete(e.target.id);
        }
        const primeiro = lista.find((id) => visiveis.has(id));
        if (primeiro) setAtual(primeiro);
      },
      { rootMargin: "0px 0px -60% 0px" },
    );
    for (const id of lista) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [ids, seguir, setAtual]);
  return (
    <nav aria-label={messages.tableOfContents} {...rest} {...getStyles("root")}>
      <ol {...getStyles("list")}>
        {links.map((l, i) => (
          <li key={l.id}>
            <a href={`#${l.id}`} aria-current={atual === l.id ? "location" : undefined} onClick={() => setAtual(l.id)} {...getStyles("link", { "--toc-depth": l.depth ?? 0 })}>
              {/* a lista (ol) já diz a posição ao leitor de tela */}
              {withNumbers && <span aria-hidden {...getStyles("number")}>{String(i + 1).padStart(2, "0")}</span>}
              {l.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
