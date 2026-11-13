import { Button, Modal } from "@countify-oficial/native";
import { useCountifyTheme, useMessages } from "@countify-oficial/provider";
import { fontSize, nativeFontFamily, space } from "@countify-oficial/tokens";
import { createContext, useContext, type ReactNode } from "react";
import { Text, View } from "react-native";
import { modalsStore, useModalsState, type ConfirmModalProps, type ContextModals, type ModalItem, type ModalsApi, type ModalSettings, type ModalsStore } from "./store";

const ModalsContext = createContext<ModalsApi>(modalsStore);

export function useModals(): ModalsApi {
  return useContext(ModalsContext);
}

export interface ModalsProviderProps {
  children?: ReactNode;
  modals?: ContextModals | undefined;
  labels?: { confirm?: ReactNode; cancel?: ReactNode } | undefined;
  store?: ModalsStore | undefined;
}

/** Desenha as janelas abertas por modals.open(), modals.openConfirmModal() e modals.openContextModal(). */
export function ModalsProvider({ children, modals: registradas = {}, labels, store = modalsStore }: ModalsProviderProps) {
  const abertas = useModalsState(store);
  return (
    <ModalsContext value={store}>
      {children}
      {abertas.map((m) => (
        <Janela key={m.id} item={m} registradas={registradas} labels={labels} store={store} />
      ))}
    </ModalsContext>
  );
}

function base(p: ModalSettings) {
  return {
    title: p.title,
    withCloseButton: p.withCloseButton,
    closeOnClickOutside: p.closeOnClickOutside,
    fullScreen: p.fullScreen,
    ...(typeof p.size === "number" ? { size: p.size } : {}),
  };
}

function Janela({ item, registradas, labels, store }: { item: ModalItem; registradas: ContextModals; labels: ModalsProviderProps["labels"]; store: ModalsStore }) {
  const fechar = () => store.close(item.id);
  if (item.tipo === "content") {
    return (
      <Modal opened onClose={fechar} {...base(item.props)}>
        {item.props.children}
      </Modal>
    );
  }
  if (item.tipo === "context") {
    const Componente = registradas[item.props.modal];
    if (!Componente) throw new Error(`Janela "${item.props.modal}" não registrada no ModalsProvider`);
    return (
      <Modal opened onClose={fechar} {...base(item.props)}>
        <Componente context={store} id={item.id} innerProps={item.props.innerProps as never} />
      </Modal>
    );
  }
  return <Confirmar id={item.id} props={item.props} labels={labels} store={store} />;
}

/** Confirmar do M-Confirmar: texto em text2 e dois botões iguais lado a lado, a 12. */
function Confirmar({ id, props: p, labels, store }: { id: string; props: ConfirmModalProps; labels: ModalsProviderProps["labels"]; store: ModalsStore }) {
  const messages = useMessages();
  const { colors: c } = useCountifyTheme();
  const cancelar = () => {
    p.onCancel?.();
    if (p.closeOnCancel ?? true) store.close(id);
  };
  const confirmar = () => {
    p.onConfirm?.();
    if (p.closeOnConfirm ?? true) store.close(id);
  };
  return (
    <Modal opened onClose={cancelar} {...base(p)} withCloseButton={p.withCloseButton ?? false}>
      {typeof p.children === "string" ? <Text style={{ color: c.text2, fontSize: fontSize.sm, fontFamily: nativeFontFamily[400] }}>{p.children}</Text> : p.children}
      <View style={{ flexDirection: "row", gap: space[3], marginTop: space[3] }}>
        <Button variant="outline" style={{ flex: 1 }} onPress={cancelar}>{p.labels?.cancel ?? labels?.cancel ?? messages.cancel}</Button>
        <Button color={p.confirmColor} style={{ flex: 1 }} onPress={confirmar}>{p.labels?.confirm ?? labels?.confirm ?? messages.confirm}</Button>
      </View>
    </Modal>
  );
}
