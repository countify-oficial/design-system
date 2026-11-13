import { useComponentProps } from "@countify-oficial/provider";
import { useEffect, useState, type ComponentPropsWithRef } from "react";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./Toolbar.module.css";

const FOCAVEIS = 'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), [tabindex]:not([data-toolbar-skip])';

export interface ToolbarProps extends StylesApiProps, Omit<ComponentPropsWithRef<"div">, "className" | "style"> {
  /** O nome da barra para o leitor de tela ("Formatação", "Ações da tabela"). */
  "aria-label": string;
  /** Padrão: horizontal. */
  orientation?: "horizontal" | "vertical" | undefined;
}

/** Barra de botões (role toolbar): uma parada no Tab; as setas, Home e End andam entre os botões. */
export function Toolbar(props: ToolbarProps) {
  const { orientation = "horizontal", className, style, classNames, styles, ...rest } = useComponentProps("Toolbar", {}, props);
  const getStyles = useStyles("Toolbar", classes, { className, style, classNames, styles });
  const [raiz, setRaiz] = useState<HTMLDivElement | null>(null);
  const [atual, setAtual] = useState(0);
  const itens = () => Array.from(raiz?.querySelectorAll<HTMLElement>(FOCAVEIS) ?? []);
  // só um item fica no Tab (o último usado)
  useEffect(() => {
    const lista = Array.from(raiz?.querySelectorAll<HTMLElement>(FOCAVEIS) ?? []);
    lista.forEach((el, i) => (el.tabIndex = i === Math.min(atual, lista.length - 1) ? 0 : -1));
  });
  const [antes, depois] = orientation === "vertical" ? ["ArrowUp", "ArrowDown"] : ["ArrowLeft", "ArrowRight"];
  return (
    <div
      ref={setRaiz}
      role="toolbar"
      aria-orientation={orientation}
      onFocus={(e) => {
        const i = itens().indexOf(e.target);
        if (i >= 0) setAtual(i);
      }}
      onKeyDown={(e) => {
        const lista = itens();
        const i = lista.indexOf(e.target as HTMLElement);
        const n = lista.length;
        const destino = { [antes]: (i - 1 + n) % n, [depois]: (i + 1) % n, Home: 0, End: n - 1 }[e.key];
        if (i < 0 || destino === undefined) return;
        e.preventDefault();
        lista[destino]?.focus();
      }}
      {...rest}
      {...getStyles("root")}
    />
  );
}
