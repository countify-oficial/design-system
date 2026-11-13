import { Button, Modal } from "@countify-oficial/core";
import { useMessages } from "@countify-oficial/provider";
import { createContext, useContext, type ReactNode } from "react";
import { modalsStore, useModalsState, type ConfirmModalProps, type ContextModals, type ModalItem, type ModalsApi, type ModalSettings, type ModalsStore } from "./store";
import classes from "./ModalsProvider.module.css";

const ModalsContext = createContext<ModalsApi>(modalsStore);

/** As funções de abrir e fechar (as mesmas do modals, ou as do store do ModalsProvider). */
export function useModals(): ModalsApi {
  return useContext(ModalsContext);
}

export interface ModalsProviderProps {
  children?: ReactNode;
  /** Janelas registradas por nome, para modals.openContextModal({ modal: "nome" }). */
  modals?: ContextModals | undefined;
  /** Rótulos padrão da confirmação. */
  labels?: { confirm?: ReactNode; cancel?: ReactNode } | undefined;
  /** Padrão: o store do app (modals.open). */
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
    closeOnEscape: p.closeOnEscape,
    closeOnClickOutside: p.closeOnClickOutside,
    size: p.size,
    fullScreen: p.fullScreen,
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

function Confirmar({ id, props: p, labels, store }: { id: string; props: ConfirmModalProps; labels: ModalsProviderProps["labels"]; store: ModalsStore }) {
  const messages = useMessages();
  const cancelar = () => {
    p.onCancel?.();
    if (p.closeOnCancel ?? true) store.close(id);
  };
  const confirmar = () => {
    p.onConfirm?.();
    if (p.closeOnConfirm ?? true) store.close(id);
  };
  return (
    <Modal opened onClose={cancelar} role="alertdialog" {...base(p)} withCloseButton={p.withCloseButton ?? false}>
      {typeof p.children === "string" ? <p className={classes["text"]}>{p.children}</p> : p.children}
      <div className={classes["actions"]}>
        <Button variant="outline" onClick={cancelar}>{p.labels?.cancel ?? labels?.cancel ?? messages.cancel}</Button>
        <Button color={p.confirmColor} onClick={confirmar}>{p.labels?.confirm ?? labels?.confirm ?? messages.confirm}</Button>
      </div>
    </Modal>
  );
}
