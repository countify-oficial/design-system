import { Combobox, Icon, Input, Modal } from "@countify-oficial/core";
import { useComponentProps, useMessages } from "@countify-oficial/provider";
import { useEffect, useState, type ChangeEvent, type ReactNode } from "react";
import { filterActions, spotlightStore, useSpotlightOpened, type SpotlightAction, type SpotlightStore } from "./store";
import classes from "./Spotlight.module.css";

export interface SpotlightProps {
  actions: SpotlightAction[];
  /** O atalho que abre e fecha: "mod+K" (Ctrl+K no Windows e Linux, ⌘K no Mac). null desliga. Padrão: "mod+K". */
  shortcut?: string | null | undefined;
  /** Quantos resultados mostrar. */
  limit?: number | undefined;
  searchPlaceholder?: string | undefined;
  nothingFound?: ReactNode;
  /** Padrão: o store do app (spotlight.open()). */
  store?: SpotlightStore | undefined;
}

/** O atalho "mod+K" bate com o evento? */
export function matchesShortcut(e: Pick<KeyboardEvent, "key" | "metaKey" | "ctrlKey">, atalho: string): boolean {
  const partes = atalho.toLowerCase().split("+");
  const tecla = partes.at(-1) ?? "";
  const mod = partes.includes("mod");
  return e.key.toLowerCase() === tecla && (!mod || e.metaKey || e.ctrlKey);
}

/** Busca rápida (web e Electron): abre com Ctrl+K / ⌘K ou spotlight.open(); setas andam, Enter executa, Esc fecha. */
export function Spotlight(props: SpotlightProps) {
  const messages = useMessages();
  const { actions, shortcut = "mod+K", limit, searchPlaceholder = messages.search, nothingFound = messages.nothingFound, store = spotlightStore } = useComponentProps("Spotlight", {}, props);
  const aberto = useSpotlightOpened(store);
  const [busca, setBusca] = useState("");
  useEffect(() => {
    if (!shortcut) return;
    const ouvir = (e: KeyboardEvent) => {
      if (!matchesShortcut(e, shortcut)) return;
      e.preventDefault();
      store.toggle();
    };
    window.addEventListener("keydown", ouvir);
    return () => window.removeEventListener("keydown", ouvir);
  }, [shortcut, store]);
  const fechar = () => {
    store.close();
    setBusca("");
  };
  const lista = filterActions(actions, busca, limit);
  const grupos = [...new Set(lista.map((a) => a.group ?? ""))].map((g) => ({ nome: g, itens: lista.filter((a) => (a.group ?? "") === g) }));
  const opcao = (a: SpotlightAction) => (
    <Combobox.Option key={a.id} value={a.id} withCheckIcon={false} className={classes["action"]}>
      <span className={classes["body"]}>
        {a.leftSection}
        <span className={classes["text"]}>
          <span className={classes["label"]}>{a.label}</span>
          {a.description && <span className={classes["description"]}>{a.description}</span>}
        </span>
      </span>
    </Combobox.Option>
  );
  return (
    <Modal opened={aberto} onClose={fechar} withCloseButton={false} centered={false} size="var(--cf-spotlight-width)" aria-label={searchPlaceholder}>
      <Combobox
        inline
        onOptionSubmit={(id) => {
          const acao = actions.find((a) => a.id === id);
          fechar();
          acao?.onClick?.();
        }}
      >
        <Combobox.Target>
          <Input aria-label={searchPlaceholder} placeholder={searchPlaceholder} leftSection={<Icon name="search" />} value={busca} onChange={(e: ChangeEvent<HTMLInputElement>) => setBusca(e.currentTarget.value)} />
        </Combobox.Target>
        <Combobox.Dropdown className={classes["list"]}>
          {lista.length === 0 ? (
            <Combobox.Empty>{nothingFound}</Combobox.Empty>
          ) : (
            grupos.map((g) => (g.nome ? <Combobox.Group key={g.nome} label={g.nome}>{g.itens.map(opcao)}</Combobox.Group> : g.itens.map(opcao)))
          )}
        </Combobox.Dropdown>
      </Combobox>
    </Modal>
  );
}
