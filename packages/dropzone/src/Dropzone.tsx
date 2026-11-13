import { Icon, Loader } from "@countify-oficial/core";
import { useComponentProps, useMessages } from "@countify-oficial/provider";
import { createContext, useContext, useState, type CSSProperties, type DragEvent, type KeyboardEvent, type ReactNode } from "react";
import { splitFiles, type AcceptOptions, type FileRejection } from "./accept";
import classes from "./Dropzone.module.css";

type Estado = "idle" | "accept" | "reject";
const EstadoContext = createContext<Estado>("idle");

export interface DropzoneProps extends AcceptOptions {
  /** Os arquivos aceitos (soltos ou escolhidos). */
  onDrop: (files: File[]) => void;
  /** Os recusados, com o motivo de cada um. */
  onReject?: ((rejections: FileRejection[]) => void) | undefined;
  disabled?: boolean | undefined;
  /** Girador no lugar do conteúdo (enviando). */
  loading?: boolean | undefined;
  /** Clicar (ou Enter/espaço) abre a janela de arquivos. Padrão: true. */
  activateOnClick?: boolean | undefined;
  /** O que aparece dentro; use Dropzone.Idle, Dropzone.Accept e Dropzone.Reject para cada estado. Padrão: ícone e texto. */
  children?: ReactNode;
  /** O nome da área para o leitor de tela. Padrão: o texto padrão. */
  "aria-label"?: string | undefined;
  className?: string | undefined;
  style?: CSSProperties | undefined;
}

/** O tipo dos arquivos que estão sendo arrastados ainda não é conhecido antes de soltar; o item já diz o MIME. */
function estadoDoArraste(e: DragEvent<HTMLElement>, accept: string[] | undefined, multiple: boolean, maxFiles: number | undefined): Estado {
  const itens = Array.from(e.dataTransfer.items).filter((i) => i.kind === "file");
  if (itens.length === 0) return "idle";
  if ((!multiple && itens.length > 1) || (maxFiles !== undefined && itens.length > maxFiles)) return "reject";
  if (!accept?.length) return "accept";
  const ok = itens.every((i) => accept.some((a) => (a.startsWith(".") ? true : a.endsWith("/*") ? i.type.startsWith(a.slice(0, -1)) : i.type === a)));
  return ok ? "accept" : "reject";
}

/** Área de soltar arquivos (web e Electron): arrastar ou clicar para escolher; aceita por tipo, tamanho e quantidade. */
function DropzoneRoot(props: DropzoneProps) {
  const messages = useMessages();
  const {
    onDrop, onReject, accept, maxSize, maxFiles, multiple = true, disabled, loading, activateOnClick = true, children, "aria-label": nome, className, style,
  } = useComponentProps("Dropzone", {}, props);
  const [estado, setEstado] = useState<Estado>("idle");
  const [entrada, setEntrada] = useState<HTMLInputElement | null>(null);
  const parado = disabled || loading;
  const receber = (lista: File[]) => {
    const { accepted, rejected } = splitFiles(lista, { accept, maxSize, maxFiles, multiple });
    if (accepted.length) onDrop(accepted);
    if (rejected.length) onReject?.(rejected);
  };
  const abrir = () => {
    if (!parado && activateOnClick) entrada?.click();
  };
  return (
    <EstadoContext value={estado}>
      <div
        role="button"
        tabIndex={parado ? -1 : 0}
        aria-label={nome}
        aria-disabled={parado || undefined}
        aria-busy={loading || undefined}
        data-accept={estado === "accept" || undefined}
        data-reject={estado === "reject" || undefined}
        data-disabled={parado || undefined}
        className={[classes["root"], className].filter(Boolean).join(" ")}
        style={style}
        onClick={abrir}
        onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
          if (e.key !== "Enter" && e.key !== " ") return;
          e.preventDefault();
          abrir();
        }}
        onDragOver={(e: DragEvent<HTMLDivElement>) => {
          e.preventDefault();
          if (!parado) setEstado(estadoDoArraste(e, accept, multiple, maxFiles));
        }}
        onDragLeave={() => setEstado("idle")}
        onDrop={(e: DragEvent<HTMLDivElement>) => {
          e.preventDefault();
          setEstado("idle");
          if (!parado) receber(Array.from(e.dataTransfer.files));
        }}
      >
        {loading ? <Loader /> : (children ?? (
          <>
            <Icon name="upload" />
            {messages.dropFiles}
          </>
        ))}
      </div>
      {/* fora da área: um controle não pode ficar dentro do outro; hidden ainda abre a janela de arquivos pelo click() */}
      <input
        ref={setEntrada}
        type="file"
        tabIndex={-1}
        hidden
        accept={accept?.join(",")}
        multiple={multiple}
        disabled={parado}
        onChange={(e) => {
          receber(Array.from(e.currentTarget.files ?? []));
          e.currentTarget.value = "";
        }}
      />
    </EstadoContext>
  );
}

const mostrarEm = (alvo: Estado) =>
  function Parte({ children }: { children?: ReactNode }) {
    return useContext(EstadoContext) === alvo ? children : null;
  };

/** Só aparece parado (nada sendo arrastado). */
export const DropzoneIdle = mostrarEm("idle");
/** Só aparece arrastando arquivos que serão aceitos. */
export const DropzoneAccept = mostrarEm("accept");
/** Só aparece arrastando arquivos que serão recusados. */
export const DropzoneReject = mostrarEm("reject");

/** Dropzone com Dropzone.Idle, Dropzone.Accept e Dropzone.Reject. */
export const Dropzone = Object.assign(DropzoneRoot, { Idle: DropzoneIdle, Accept: DropzoneAccept, Reject: DropzoneReject });
