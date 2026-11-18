import { useControllableState, useDebounce, useId } from "@countify-oficial/hooks";
import { hasContent, useComponentProps, useMessages } from "@countify-oficial/provider";
import { useEffect, useRef, type ChangeEvent, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { CloseButton } from "../CloseButton/CloseButton";
import { Icon } from "../Icon/Icon";
import { InputBase, type InputBaseOwnProps } from "../Input/Input";
import { Kbd } from "../Kbd/Kbd";
import type { PolymorphicProps } from "../polymorphic";
import { cx } from "../styles";
import classes from "./SearchInput.module.css";

export type SearchInputProps = PolymorphicProps<
  "input",
  Omit<InputBaseOwnProps, "rightSection" | "rightSectionPointerEvents"> & {
    /** Texto da busca (controlado). */
    value?: string | undefined;
    /** Texto inicial (não controlado). */
    defaultValue?: string | undefined;
    /** Chamado a cada mudança do texto, inclusive ao limpar (com ""). */
    onChange?: ((value: string) => void) | undefined;
    /** Chamado com o texto da busca depois de `debounce` ms sem digitar (e com "" ao limpar). */
    onSearch?: ((value: string) => void) | undefined;
    /** Espera, em ms, entre a última tecla e o onSearch. Padrão: 0 (busca a cada mudança). */
    debounce?: number | undefined;
    /**
     * Atalho que leva o foco ao campo, mostrado num Kbd à direita enquanto o campo está vazio: "/" ou "mod+K"
     * (Ctrl+K no Windows e Linux, ⌘K no Mac). Sem modificador, a tecla não vale com o foco em outro campo. Só na web.
     */
    shortcut?: string | undefined;
  }
>;

// shortcut: lê o sistema no navegador; com renderização no servidor, o texto do Kbd pode mudar na hidratação
const noMac = () => typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent);

/** O atalho bate com a tecla? "mod" é Ctrl ou ⌘; sem ele, nenhum dos dois pode estar apertado. */
function bate(e: KeyboardEvent, atalho: string) {
  const partes = atalho.toLowerCase().split("+");
  return e.key.toLowerCase() === partes.at(-1) && partes.includes("mod") === (e.metaKey || e.ctrlKey);
}

/** Campo de busca do mockup ("Busca no topo da lista"): lupa à esquerda, × para limpar, Esc limpa e atalho opcional. */
export function SearchInput(props: SearchInputProps) {
  const messages = useMessages();
  const {
    value, defaultValue, onChange, onSearch, debounce = 0, shortcut, disabled, label, id, onKeyDown, classNames,
    leftSection = <Icon name="search" />, placeholder = messages.search, "aria-label": nome, ...rest
  } = useComponentProps("SearchInput", {}, props);
  const [texto, setTexto] = useControllableState({ value, defaultValue: defaultValue ?? "", onChange });
  // o foco do atalho e do × acha o campo pelo id: o ref fica todo para quem usa
  // shortcut: getElementById não entra em shadow DOM; se um app desenhar o campo lá, trocar por ref
  const campo = useId(id);
  const mod = /^mod\+/i.test(shortcut ?? "");

  const buscado = useDebounce(texto, debounce);
  const ultimaBusca = useRef(buscado);
  useEffect(() => {
    if (buscado === ultimaBusca.current) return;
    ultimaBusca.current = buscado;
    onSearch?.(buscado);
  }, [buscado, onSearch]);

  useEffect(() => {
    if (!shortcut || disabled) return;
    const ouvir = (e: KeyboardEvent) => {
      if (e.defaultPrevented || !bate(e, shortcut)) return;
      const alvo = e.target instanceof HTMLElement ? e.target : null;
      // sem modificador a tecla é texto: dentro de outro campo, fica com ele
      if (!mod && alvo && (alvo.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(alvo.tagName))) return;
      e.preventDefault();
      document.getElementById(campo)?.focus();
    };
    window.addEventListener("keydown", ouvir);
    return () => window.removeEventListener("keydown", ouvir);
  }, [shortcut, disabled, mod, campo]);

  const limpar = () => {
    setTexto("");
    document.getElementById(campo)?.focus();
  };
  const atalhoAria = shortcut && !disabled ? (mod ? ["Control", "Meta"].map((m) => shortcut.replace(/^mod/i, m)).join(" ") : shortcut) : undefined;
  const teclas = shortcut?.split("+").map((t) => (t.toLowerCase() === "mod" ? (noMac() ? "⌘" : "Ctrl") : t));

  return (
    <InputBase
      {...rest}
      component="input"
      type="search"
      role="searchbox"
      label={label}
      aria-label={nome ?? (hasContent(label) ? undefined : messages.search)}
      aria-keyshortcuts={atalhoAria}
      placeholder={placeholder}
      disabled={disabled}
      leftSection={leftSection}
      classNames={{ ...classNames, input: cx(classes["input"], classNames?.input) ?? "" }}
      id={campo}
      value={texto}
      onChange={(e: ChangeEvent<HTMLInputElement>) => setTexto(e.currentTarget.value)}
      onKeyDown={(e: ReactKeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(e);
        // Esc com texto limpa e para aqui (não fecha o Modal em volta); vazio, segue adiante
        if (e.key !== "Escape" || e.defaultPrevented || texto === "") return;
        e.preventDefault();
        e.stopPropagation();
        setTexto("");
      }}
      rightSection={
        texto !== "" ? (
          <CloseButton aria-label={messages.clearSearch} color="text2" disabled={disabled} onClick={limpar} />
        ) : teclas && !disabled ? (
          <Kbd aria-hidden>{teclas.join(" ")}</Kbd>
        ) : undefined
      }
    />
  );
}
