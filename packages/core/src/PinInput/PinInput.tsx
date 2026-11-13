import { useControllableState, useId } from "@countify-oficial/hooks";
import { useComponentProps } from "@countify-oficial/provider";
import type { Size } from "@countify-oficial/tokens";
import { useState, type ClipboardEvent, type ComponentPropsWithRef, type KeyboardEvent } from "react";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./PinInput.module.css";

export interface PinInputProps extends StylesApiProps<"root" | "input">, Omit<ComponentPropsWithRef<"div">, "className" | "style" | "onChange" | "defaultValue"> {
  /** Quantas caixas. Padrão: 4. */
  length?: number | undefined;
  /** number: só algarismos; alphanumeric: letras e algarismos. Padrão: number. */
  type?: "number" | "alphanumeric" | undefined;
  /** Esconde o que foi digitado (senha). */
  mask?: boolean | undefined;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  /** Chamado quando todas as caixas estão cheias. */
  onComplete?: ((value: string) => void) | undefined;
  /** Nome para o leitor de tela; cada caixa vira "nome, 1 de 4". Padrão: "Código". */
  label?: string | undefined;
  /** Lado de cada caixa: o da altura do campo (xs/sm 44, md 48…). Padrão: md. */
  size?: Size | undefined;
  /** filled ou outline, como o Input. Padrão: filled. */
  variant?: "filled" | "outline" | undefined;
  error?: boolean | undefined;
  disabled?: boolean | undefined;
  /** Foca a primeira caixa ao montar. */
  autoFocus?: boolean | undefined;
  /** name do campo escondido com o valor (formulários). */
  name?: string | undefined;
}

/** Código em caixas (verificação por SMS, código da câmera): avança sozinho, volta com Backspace e aceita colar. */
export function PinInput(props: PinInputProps) {
  const {
    length = 4, type = "number", mask, value, defaultValue, onChange, onComplete, label = "Código", size = "md", variant = "filled",
    error, disabled, autoFocus, name, id, className, style, classNames, styles, ...rest
  } = useComponentProps("PinInput", {}, props);
  const getStyles = useStyles("PinInput", classes, { className, style, classNames, styles });
  const base = useId(id);
  const [codigo, setCodigo] = useControllableState({ value, defaultValue: defaultValue ?? "", onChange });
  const [grupo, setGrupo] = useState<HTMLDivElement | null>(null);
  const aceita = type === "number" ? /^\d$/ : /^[\p{L}\d]$/u;
  // as caixas são os <input> visíveis do grupo, na ordem
  const focar = (i: number) => grupo?.querySelectorAll<HTMLInputElement>("input:not([type=hidden])")[Math.max(0, Math.min(length - 1, i))]?.focus();
  const gravar = (novo: string) => {
    const v = novo.slice(0, length);
    setCodigo(v);
    if (v.length === length && !v.includes(" ")) onComplete?.(v);
  };
  const escrever = (i: number, texto: string) => {
    const letras = Array.from(texto).filter((c) => aceita.test(c));
    if (letras.length === 0) return;
    const atual = Array.from({ length }, (_, k) => codigo[k] ?? " ");
    letras.forEach((c, k) => {
      if (i + k < length) atual[i + k] = c;
    });
    gravar(atual.join("").trimEnd());
    focar(i + letras.length);
  };
  const aoTeclar = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const atual = Array.from({ length }, (_, k) => codigo[k] ?? " ");
      const alvo = atual[i]?.trim() ? i : i - 1;
      if (alvo < 0) return;
      atual[alvo] = " ";
      gravar(atual.join("").trimEnd());
      focar(alvo);
    } else if (e.key === "ArrowLeft") focar(i - 1);
    else if (e.key === "ArrowRight") focar(i + 1);
  };
  return (
    <div ref={setGrupo} role="group" aria-label={label} {...rest} data-variant={variant} data-error={error || undefined} {...getStyles("root", { "--pin-size": `var(--cf-input-height-${size})` })}>
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          id={i === 0 ? base : undefined}
          aria-label={`${label}, ${i + 1} de ${length}`}
          aria-invalid={error || undefined}
          type={mask ? "password" : "text"}
          inputMode={type === "number" ? "numeric" : "text"}
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={length}
          disabled={disabled}
          // eslint-disable-next-line jsx-a11y/no-autofocus -- pedido explícito do app (tela só de código)
          autoFocus={autoFocus && i === 0}
          value={(codigo[i] ?? "").trim()}
          onChange={(e) => escrever(i, e.currentTarget.value.slice(-1))}
          onPaste={(e: ClipboardEvent<HTMLInputElement>) => {
            e.preventDefault();
            escrever(i, e.clipboardData.getData("text"));
          }}
          onKeyDown={(e) => aoTeclar(i, e)}
          onFocus={(e) => e.currentTarget.select()}
          {...getStyles("input")}
        />
      ))}
      {name !== undefined && <input type="hidden" name={name} value={codigo.replace(/\s/g, "")} />}
    </div>
  );
}
