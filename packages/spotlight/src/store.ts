import { normalizeSearch } from "@countify-oficial/provider";
import type { ReactNode } from "react";
import { useSyncExternalStore } from "react";

export interface SpotlightAction {
  id: string;
  label: string;
  description?: string | undefined;
  /** Grupo ("Telas", "Lojas", "Ações"). */
  group?: string | undefined;
  /** Outras palavras que acham esta ação ("vendas" acha "Análises"). */
  keywords?: string[] | undefined;
  leftSection?: ReactNode;
  onClick?: (() => void) | undefined;
}

/** As ações que batem com a busca (sem acento e sem maiúsculas), na ordem; vazio devolve todas. */
export function filterActions(acoes: SpotlightAction[], busca: string, limite = Infinity): SpotlightAction[] {
  const termos = normalizeSearch(busca).split(/\s+/).filter(Boolean);
  const batem = termos.length === 0 ? acoes : acoes.filter((a) => {
    const texto = normalizeSearch([a.label, a.description ?? "", a.group ?? "", ...(a.keywords ?? [])].join(" "));
    return termos.every((t) => texto.includes(t));
  });
  return batem.slice(0, limite);
}

export interface SpotlightStore {
  getState: () => boolean;
  subscribe: (ouvinte: () => void) => () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export function createSpotlightStore(): SpotlightStore {
  let aberto = false;
  const ouvintes = new Set<() => void>();
  const trocar = (v: boolean) => {
    if (v === aberto) return;
    aberto = v;
    for (const o of ouvintes) o();
  };
  return {
    getState: () => aberto,
    subscribe: (o) => {
      ouvintes.add(o);
      return () => ouvintes.delete(o);
    },
    open: () => trocar(true),
    close: () => trocar(false),
    toggle: () => trocar(!aberto),
  };
}

export const spotlightStore = createSpotlightStore();

/** Abre e fecha a busca de qualquer lugar: spotlight.open(). */
export const spotlight = { open: () => spotlightStore.open(), close: () => spotlightStore.close(), toggle: () => spotlightStore.toggle() };

export const useSpotlightOpened = (store: SpotlightStore = spotlightStore): boolean => useSyncExternalStore(store.subscribe, store.getState, store.getState);
