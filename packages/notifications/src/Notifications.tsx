import { Notification, Portal } from "@countify-oficial/core";
import { duration } from "@countify-oficial/tokens";
import { useEffect, useState } from "react";
import { notificationsStore, useNotifications, type NotificationItem, type NotificationsStore } from "./store";
import classes from "./Notifications.module.css";

export interface NotificationsProps {
  /** Quantos aparecem juntos; os outros esperam na fila. Padrão: 1 (um aviso por vez, como na 0.1.0). */
  limit?: number | undefined;
  /** Tempo até sumir, em ms; false não some. Padrão: 4000 (0.1.0). */
  autoClose?: number | false | undefined;
  /** Padrão: o store do app (notifications.show). */
  store?: NotificationsStore | undefined;
}

/** Onde os avisos aparecem. Ponha um na raiz do app; mostre com notifications.show(). */
export function Notifications({ limit = 1, autoClose = duration.notification, store = notificationsStore }: NotificationsProps) {
  const lista = useNotifications(store);
  if (lista.length === 0) return null;
  return (
    <Portal>
      <div className={classes["root"]}>
        {lista.slice(0, limit).map((n) => (
          <Aviso key={n.id} dados={n} padrao={autoClose} store={store} />
        ))}
      </div>
    </Portal>
  );
}

function Aviso({ dados, padrao, store }: { dados: NotificationItem; padrao: number | false; store: NotificationsStore }) {
  const { id, title, message, color, icon, loading, action, withCloseButton, autoClose } = dados;
  const tempo = autoClose ?? padrao;
  // com o mouse em cima ou o foco dentro, o tempo para (dá para ler e usar a ação)
  const [parado, setParado] = useState(false);
  useEffect(() => {
    if (tempo === false || parado || loading) return;
    const t = setTimeout(() => store.hide(id), tempo);
    return () => clearTimeout(t);
  }, [id, tempo, parado, loading, store]);
  return (
    <div
      className={classes["item"]}
      onMouseEnter={() => setParado(true)}
      onMouseLeave={() => setParado(false)}
      onFocus={() => setParado(true)}
      onBlur={() => setParado(false)}
    >
      <Notification title={title} color={color} icon={icon} loading={loading} action={action} withCloseButton={withCloseButton} onClose={() => store.hide(id)}>
        {message}
      </Notification>
    </div>
  );
}
