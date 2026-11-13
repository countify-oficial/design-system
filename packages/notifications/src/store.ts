import type { ReactNode } from "react";
import { useSyncExternalStore } from "react";

export interface NotificationData {
  /** Para atualizar ou fechar depois. Padrão: um id novo. */
  id?: string | undefined;
  title?: ReactNode;
  message: ReactNode;
  /** default: cores invertidas; down: erro. */
  color?: "default" | "down" | undefined;
  icon?: ReactNode;
  /** Girador (salvando…); não some sozinho enquanto carrega. */
  loading?: boolean | undefined;
  /** Ação curta ("Desfazer"). */
  action?: ReactNode;
  withCloseButton?: boolean | undefined;
  /** Some sozinho depois de tantos ms; false fica até fechar. Padrão: o do Notifications (4 s). */
  autoClose?: number | false | undefined;
  /** Chamado quando o aviso sai (pelo tempo, pelo botão ou por hide). */
  onClose?: ((id: string) => void) | undefined;
}

export type NotificationItem = NotificationData & { id: string };

export interface NotificationsStore {
  getState: () => NotificationItem[];
  subscribe: (ouvinte: () => void) => () => void;
  /** Mostra um aviso; devolve o id. */
  show: (dados: NotificationData) => string;
  /** Troca o conteúdo de um aviso (o "salvando…" que vira "salvo"). */
  update: (id: string, dados: Partial<NotificationData>) => void;
  hide: (id: string) => void;
  /** Tira todos, inclusive os da fila. */
  clean: () => void;
}

/** Um store de avisos (o app usa o padrão, notificationsStore; os testes criam o seu). */
export function createNotificationsStore(): NotificationsStore {
  let lista: NotificationItem[] = [];
  let seq = 0;
  const ouvintes = new Set<() => void>();
  const trocar = (nova: NotificationItem[]) => {
    lista = nova;
    for (const o of ouvintes) o();
  };
  return {
    getState: () => lista,
    subscribe: (o) => {
      ouvintes.add(o);
      return () => ouvintes.delete(o);
    },
    show: (dados) => {
      seq += 1;
      const id = dados.id ?? `aviso-${String(seq)}`;
      trocar([...lista.filter((n) => n.id !== id), { ...dados, id }]);
      return id;
    },
    update: (id, dados) => trocar(lista.map((n) => (n.id === id ? { ...n, ...dados, id } : n))),
    hide: (id) => {
      const saiu = lista.find((n) => n.id === id);
      if (!saiu) return;
      trocar(lista.filter((n) => n.id !== id));
      saiu.onClose?.(id);
    },
    clean: () => trocar([]),
  };
}

export const notificationsStore = createNotificationsStore();

/** Avisos de qualquer lugar do app: notifications.show({ message: "Salvo" }). Precisa de um <Notifications /> na tela. */
export const notifications = {
  show: (dados: NotificationData) => notificationsStore.show(dados),
  update: (id: string, dados: Partial<NotificationData>) => notificationsStore.update(id, dados),
  hide: (id: string) => notificationsStore.hide(id),
  clean: () => notificationsStore.clean(),
};

/** A lista de avisos do store, para desenhar. */
export function useNotifications(store: NotificationsStore = notificationsStore): NotificationItem[] {
  return useSyncExternalStore(store.subscribe, store.getState, store.getState);
}
