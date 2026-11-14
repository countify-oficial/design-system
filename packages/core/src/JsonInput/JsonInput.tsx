import { isValidJson, useComponentProps, useMessages } from "@countify-oficial/provider";
import { useState, type FocusEvent, type ReactNode } from "react";
import { Textarea, type TextareaProps } from "../Textarea/Textarea";

export type JsonInputProps = TextareaProps & {
  /** Reorganiza o JSON (2 espaços) ao sair do campo, se for válido. */
  formatOnBlur?: boolean | undefined;
  /** Erro mostrado se o JSON não for válido. Padrão: "JSON inválido" do provider. */
  validationError?: ReactNode;
};

/** Campo de JSON: confere ao sair do campo e pode reorganizar o texto. Letra de largura fixa. */
export function JsonInput(props: JsonInputProps) {
  const messages = useMessages();
  const { formatOnBlur, validationError = messages.invalidJson, error, onBlur, onChange, value, defaultValue, styles, ...rest } = useComponentProps("JsonInput", {}, props);
  const [texto, setTexto] = useState(String(value ?? defaultValue ?? ""));
  const [invalido, setInvalido] = useState(false);
  const atual = value === undefined ? texto : String(value);
  return (
    <Textarea
      {...rest}
      value={atual}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTexto(e.currentTarget.value);
        onChange?.(e);
      }}
      onBlur={(e: FocusEvent<HTMLTextAreaElement>) => {
        const ok = isValidJson(atual);
        setInvalido(!ok);
        if (ok && formatOnBlur && atual.trim() !== "") setTexto(JSON.stringify(JSON.parse(atual), null, 2));
        onBlur?.(e);
      }}
      error={error ?? (invalido ? validationError : undefined)}
      spellCheck={false}
      styles={{ ...styles, input: { fontFamily: "var(--cf-font-mono)", ...styles?.input } }}
    />
  );
}
