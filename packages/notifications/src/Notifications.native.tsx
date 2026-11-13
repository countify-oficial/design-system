import { Notification } from "@countify-oficial/native";
import { appShell, duration, gutter, space } from "@countify-oficial/tokens";
import { useEffect } from "react";
import { View } from "react-native";
import { notificationsStore, useNotifications, type NotificationItem, type NotificationsStore } from "./store";

export interface NotificationsProps {
  limit?: number | undefined;
  autoClose?: number | false | undefined;
  store?: NotificationsStore | undefined;
  /** O espaço do sistema embaixo (gestos), do react-native-safe-area-context. Padrão: 0. */
  bottomInset?: number | undefined;
  /** Sem as abas embaixo, o aviso desce para a margem. Padrão: true. */
  withTabBar?: boolean | undefined;
}

/** Onde os avisos aparecem: no meio, acima das abas. Ponha um na raiz do app, por cima do resto. */
export function Notifications({ limit = 1, autoClose = duration.notification, store = notificationsStore, bottomInset = 0, withTabBar = true }: NotificationsProps) {
  const lista = useNotifications(store);
  if (lista.length === 0) return null;
  const abas = withTabBar ? appShell.tabItemHeight + space[1] * 2 + space[4] : 0;
  return (
    <View pointerEvents="box-none" style={{ position: "absolute", left: gutter.mobile, right: gutter.mobile, bottom: abas + space[4] + bottomInset, alignItems: "center", gap: space[2] }}>
      {lista.slice(0, limit).map((n) => (
        <Aviso key={n.id} dados={n} padrao={autoClose} store={store} />
      ))}
    </View>
  );
}

function Aviso({ dados, padrao, store }: { dados: NotificationItem; padrao: number | false; store: NotificationsStore }) {
  const { id, title, message, color, icon, loading, action, withCloseButton, autoClose } = dados;
  const tempo = autoClose ?? padrao;
  useEffect(() => {
    if (tempo === false || loading) return;
    const t = setTimeout(() => store.hide(id), tempo);
    return () => clearTimeout(t);
  }, [id, tempo, loading, store]);
  return (
    <Notification title={title} color={color} icon={icon} loading={loading} action={action} withCloseButton={withCloseButton} onClose={() => store.hide(id)}>
      {message}
    </Notification>
  );
}
