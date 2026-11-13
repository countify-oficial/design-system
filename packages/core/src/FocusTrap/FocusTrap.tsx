import { cloneElement, useCallback, useEffect, useState, type ReactElement, type Ref } from "react";

export interface FocusTrapProps {
  /** Prende o foco enquanto true. Padrão: true. */
  active?: boolean | undefined;
  /** Devolve o foco a quem tinha antes, ao desativar ou desmontar. Padrão: true. */
  returnFocus?: boolean | undefined;
  /** Um único elemento, que recebe o ref. */
  children: ReactElement<{ ref?: Ref<HTMLElement> | undefined; tabIndex?: number | undefined }>;
}

const FOCAVEIS = [
  "a[href]", "area[href]", "button:not([disabled])", 'input:not([disabled]):not([type="hidden"])', "select:not([disabled])",
  "textarea:not([disabled])", "iframe", "summary", "audio[controls]", "video[controls]", "[tabindex]",
  '[contenteditable]:not([contenteditable="false"])',
].join(", ");

/** Elementos que o Tab alcança dentro de root, na ordem do documento. */
export const tabbables = (root: HTMLElement): HTMLElement[] =>
  Array.from(root.querySelectorAll<HTMLElement>(FOCAVEIS)).filter((el) => el.tabIndex >= 0 && !el.closest("[hidden], [inert]"));

/** Grava o elemento no ref (função ou objeto) que o filho já tinha. */
function gravarRef<T>(ref: Ref<T> | undefined, node: T | null) {
  if (typeof ref === "function") ref(node);
  else if (ref) ref.current = node;
}

/**
 * Prende o Tab dentro do filho (modais, gavetas). Ao ativar, foca o elemento com data-autofocus, ou o primeiro
 * focável, ou o próprio filho.
 */
export function FocusTrap({ active = true, returnFocus = true, children }: FocusTrapProps) {
  const [root, setRoot] = useState<HTMLElement | null>(null);
  const refDoFilho = children.props.ref;
  const juntarRefs = useCallback(
    (node: HTMLElement | null) => {
      setRoot(node);
      gravarRef(refDoFilho, node);
    },
    [refDoFilho],
  );

  useEffect(() => {
    if (!active || !root) return;
    const antes = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (!root.contains(document.activeElement)) {
      (root.querySelector<HTMLElement>("[data-autofocus]") ?? tabbables(root)[0] ?? root).focus();
    }
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const lista = tabbables(root);
      const primeiro = lista[0];
      const ultimo = lista.at(-1);
      const atual = document.activeElement;
      if (!primeiro || !ultimo) {
        e.preventDefault();
        return;
      }
      const fora = !root.contains(atual);
      if (e.shiftKey && (atual === primeiro || atual === root || fora)) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && (atual === ultimo || fora)) {
        e.preventDefault();
        primeiro.focus();
      }
    };
    document.addEventListener("keydown", aoTeclar);
    return () => {
      document.removeEventListener("keydown", aoTeclar);
      if (returnFocus) antes?.focus();
    };
  }, [active, returnFocus, root]);

  return cloneElement(children, {
    ref: juntarRefs,
    // sem nada focável dentro, o próprio filho recebe o foco (só por código, fora do Tab)
    tabIndex: children.props.tabIndex ?? (active ? -1 : undefined),
  });
}
