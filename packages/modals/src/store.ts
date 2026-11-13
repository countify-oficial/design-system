import type { ComponentType, ReactNode } from "react";
import { useSyncExternalStore } from "react";

/** O que serve para qualquer janela: título, fechar e o tamanho. */
export interface ModalSettings {
  /** Para fechar depois por modals.close(id). Padrão: um id novo. */
  modalId?: string | undefined;
  title?: ReactNode;
  withCloseButton?: boolean | undefined;
  closeOnEscape?: boolean | undefined;
  closeOnClickOutside?: boolean | undefined;
  /** Largura máxima (web). Padrão: 440. */
  size?: string | number | undefined;
  fullScreen?: boolean | undefined;
  /** Chamado quando a janela fecha, por qualquer caminho. */
  onClose?: (() => void) | undefined;
}

export interface OpenModalProps extends ModalSettings {
  children?: ReactNode;
}

export interface ConfirmModalProps extends ModalSettings {
  /** O texto da pergunta (em text2, como no mockup). */
  children?: ReactNode;
  /** Rótulos. Padrão: "Confirmar" e "Cancelar" (das mensagens do provider). */
  labels?: { confirm?: ReactNode; cancel?: ReactNode } | undefined;
  /** Cor do botão de confirmar: down para excluir. Padrão: accent. */
  confirmColor?: "accent" | "down" | "up" | "warn" | undefined;
  onConfirm?: (() => void) | undefined;
  onCancel?: (() => void) | undefined;
  /** Fecha ao confirmar. Padrão: true. */
  closeOnConfirm?: boolean | undefined;
  closeOnCancel?: boolean | undefined;
}

export interface ContextModalProps<P = Record<string, unknown>> {
  /** Para fechar a si mesma: context.close(id). */
  context: ModalsApi;
  id: string;
  innerProps: P;
}

export interface OpenContextModalProps<P = Record<string, unknown>> extends ModalSettings {
  /** O nome registrado no ModalsProvider (modals={{ nome: Componente }}). */
  modal: string;
  innerProps: P;
}

export type ModalItem =
  | { id: string; tipo: "content"; props: OpenModalProps }
  | { id: string; tipo: "confirm"; props: ConfirmModalProps }
  | { id: string; tipo: "context"; props: OpenContextModalProps };

export interface ModalsApi {
  open: (props: OpenModalProps) => string;
  openConfirmModal: (props: ConfirmModalProps) => string;
  openContextModal: <P>(props: OpenContextModalProps<P>) => string;
  close: (id: string) => void;
  closeAll: () => void;
}

export interface ModalsStore extends ModalsApi {
  getState: () => ModalItem[];
  subscribe: (ouvinte: () => void) => () => void;
}

/** Um store de janelas (o app usa o padrão, modalsStore; os testes criam o seu). */
export function createModalsStore(): ModalsStore {
  let lista: ModalItem[] = [];
  let seq = 0;
  const ouvintes = new Set<() => void>();
  const trocar = (nova: ModalItem[]) => {
    lista = nova;
    for (const o of ouvintes) o();
  };
  const abrir = (item: Omit<ModalItem, "id"> & { props: ModalSettings }) => {
    seq += 1;
    const id = item.props.modalId ?? `janela-${String(seq)}`;
    trocar([...lista.filter((m) => m.id !== id), { ...item, id } as ModalItem]);
    return id;
  };
  const fechar = (id: string) => {
    const saiu = lista.find((m) => m.id === id);
    if (!saiu) return;
    trocar(lista.filter((m) => m.id !== id));
    saiu.props.onClose?.();
  };
  return {
    getState: () => lista,
    subscribe: (o) => {
      ouvintes.add(o);
      return () => ouvintes.delete(o);
    },
    open: (props) => abrir({ tipo: "content", props }),
    openConfirmModal: (props) => abrir({ tipo: "confirm", props }),
    openContextModal: (props) => abrir({ tipo: "context", props }),
    close: fechar,
    closeAll: () => {
      for (const m of [...lista].reverse()) fechar(m.id);
    },
  };
}

export const modalsStore = createModalsStore();

/** Janelas de qualquer lugar do app: modals.openConfirmModal({ title: "Excluir análise?" }). Precisa do ModalsProvider. */
export const modals: ModalsApi = {
  open: (p) => modalsStore.open(p),
  openConfirmModal: (p) => modalsStore.openConfirmModal(p),
  openContextModal: (p) => modalsStore.openContextModal(p),
  close: (id) => modalsStore.close(id),
  closeAll: () => modalsStore.closeAll(),
};

export function useModalsState(store: ModalsStore): ModalItem[] {
  return useSyncExternalStore(store.subscribe, store.getState, store.getState);
}

export type ContextModals = Record<string, ComponentType<ContextModalProps<never>>>;
