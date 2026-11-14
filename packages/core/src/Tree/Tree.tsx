import { useControllableState } from "@countify-oficial/hooks";
import { treeCheckState, treeLeaves, useComponentProps, type TreeNode } from "@countify-oficial/provider";
import { useEffect, useState, type ComponentPropsWithRef, type KeyboardEvent } from "react";
import { Icon } from "../Icon/Icon";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./Tree.module.css";

export interface TreeProps extends StylesApiProps<"root" | "group" | "node" | "chevron" | "check" | "label">, Omit<ComponentPropsWithRef<"ul">, "className" | "style" | "onSelect" | "defaultChecked"> {
  data: TreeNode[];
  /** Nós abertos (controlado). */
  expanded?: string[] | undefined;
  defaultExpanded?: string[] | undefined;
  onExpandedChange?: ((expanded: string[]) => void) | undefined;
  /** O nó escolhido (sem caixas). */
  selected?: string | null | undefined;
  defaultSelected?: string | null | undefined;
  onSelect?: ((value: string, node: TreeNode) => void) | undefined;
  /** Caixas de marcar: marcar um pai marca as folhas de baixo; o pai fica meio marcado com só algumas. */
  withCheckboxes?: boolean | undefined;
  /** As folhas marcadas (com caixas). */
  checked?: string[] | undefined;
  defaultChecked?: string[] | undefined;
  onCheckedChange?: ((checked: string[]) => void) | undefined;
  /** Só folhas podem ser escolhidas (sem caixas). */
  leavesOnly?: boolean | undefined;
}

interface Linha {
  no: TreeNode;
  nivel: number;
  pai: string | null;
}

/** Os nós visíveis, na ordem (para as setas). */
function visiveis(dados: TreeNode[], abertos: string[], nivel = 0, pai: string | null = null): Linha[] {
  return dados.flatMap((no) => [{ no, nivel, pai }, ...(no.children?.length && abertos.includes(no.value) ? visiveis(no.children, abertos, nivel + 1, no.value) : [])]);
}

/**
 * Árvore (role tree): setas sobem e descem; direita abre ou entra; esquerda fecha ou volta ao pai; Home e End; Enter
 * ou espaço escolhe (ou marca, com caixas).
 */
export function Tree(props: TreeProps) {
  const {
    data, expanded, defaultExpanded, onExpandedChange, selected, defaultSelected, onSelect, withCheckboxes, checked, defaultChecked, onCheckedChange, leavesOnly,
    className, style, classNames, styles, ...rest
  } = useComponentProps("Tree", {}, props);
  const getStyles = useStyles("Tree", classes, { className, style, classNames, styles });
  const [abertos, setAbertos] = useControllableState<string[]>({ value: expanded, defaultValue: defaultExpanded ?? [], onChange: onExpandedChange });
  const [escolhido, setEscolhido] = useControllableState<string | null>({ value: selected, defaultValue: defaultSelected ?? null });
  const [marcados, setMarcados] = useControllableState<string[]>({ value: checked, defaultValue: defaultChecked ?? [], onChange: onCheckedChange });
  const linhas = visiveis(data, abertos);
  const [foco, setFoco] = useState<string | null>(null);
  const [raiz, setRaiz] = useState<HTMLUListElement | null>(null);
  const atual = foco ?? escolhido ?? linhas[0]?.no.value ?? null;
  // o foco do teclado segue o nó atual
  useEffect(() => {
    if (foco) raiz?.querySelector<HTMLElement>(`[data-value="${CSS.escape(foco)}"]`)?.focus();
  }, [foco, raiz]);
  const alternar = (v: string) => setAbertos(abertos.includes(v) ? abertos.filter((x) => x !== v) : [...abertos, v]);
  const acionar = (no: TreeNode) => {
    if (no.disabled) return;
    if (withCheckboxes) {
      const folhas = treeLeaves(no);
      const tudo = treeCheckState(no, marcados) === "all";
      setMarcados(tudo ? marcados.filter((m) => !folhas.includes(m)) : [...new Set([...marcados, ...folhas])]);
      return;
    }
    if (leavesOnly && no.children?.length) {
      alternar(no.value);
      return;
    }
    setEscolhido(no.value);
    onSelect?.(no.value, no);
  };
  const aoTeclar = (e: KeyboardEvent<HTMLElement>, i: number) => {
    const linha = linhas[i];
    if (!linha) return;
    const temFilhos = !!linha.no.children?.length;
    const aberto = abertos.includes(linha.no.value);
    const ir = (k: number) => {
      const destino = linhas[Math.max(0, Math.min(linhas.length - 1, k))];
      if (destino) setFoco(destino.no.value);
    };
    const acoes: Record<string, () => void> = {
      ArrowDown: () => ir(i + 1),
      ArrowUp: () => ir(i - 1),
      Home: () => ir(0),
      End: () => ir(linhas.length - 1),
      ArrowRight: () => (temFilhos ? (aberto ? ir(i + 1) : alternar(linha.no.value)) : undefined),
      ArrowLeft: () => (temFilhos && aberto ? alternar(linha.no.value) : linha.pai ? setFoco(linha.pai) : undefined),
      Enter: () => acionar(linha.no),
      " ": () => acionar(linha.no),
    };
    const acao = acoes[e.key];
    if (!acao) return;
    e.preventDefault();
    acao();
  };
  const desenhar = (nos: TreeNode[], nivel: number) =>
    nos.map((no) => {
      const temFilhos = !!no.children?.length;
      const aberto = abertos.includes(no.value);
      const i = linhas.findIndex((l) => l.no.value === no.value);
      const estado = withCheckboxes ? treeCheckState(no, marcados) : undefined;
      return (
        <li key={no.value} role="none">
          <div
            role="treeitem"
            data-value={no.value}
            tabIndex={atual === no.value ? 0 : -1}
            aria-level={nivel + 1}
            aria-expanded={temFilhos ? aberto : undefined}
            aria-selected={withCheckboxes ? undefined : escolhido === no.value}
            aria-checked={estado === undefined ? undefined : estado === "all" ? true : estado === "some" ? "mixed" : false}
            aria-disabled={no.disabled || undefined}
            onClick={() => {
              setFoco(no.value);
              if (!withCheckboxes && temFilhos) alternar(no.value);
              if (withCheckboxes || !(leavesOnly && temFilhos)) acionar(no);
            }}
            onKeyDown={(e) => aoTeclar(e, i)}
            {...getStyles("node", { "--tree-level": nivel })}
          >
            <span
              aria-hidden
              onClick={(e) => {
                if (!temFilhos) return;
                e.stopPropagation();
                alternar(no.value);
              }}
              {...getStyles("chevron")}
            >
              {temFilhos && <Icon name="chevron-right" size="sm" />}
            </span>
            {withCheckboxes && (
              <input
                type="checkbox"
                tabIndex={-1}
                aria-hidden
                readOnly
                checked={estado === "all"}
                ref={(el) => {
                  if (el) el.indeterminate = estado === "some";
                }}
                {...getStyles("check")}
              />
            )}
            <span {...getStyles("label")}>{no.label}</span>
          </div>
          {temFilhos && aberto && <ul role="group" {...getStyles("group")}>{desenhar(no.children ?? [], nivel + 1)}</ul>}
        </li>
      );
    });
  return (
    <ul ref={setRaiz} role="tree" aria-multiselectable={withCheckboxes || undefined} {...rest} {...getStyles("root")}>
      {desenhar(data, 0)}
    </ul>
  );
}
