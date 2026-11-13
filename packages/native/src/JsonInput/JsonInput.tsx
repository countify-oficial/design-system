import { useComponentProps, useMessages } from "@countify-oficial/provider";
import { nativeMonoFontFamily } from "@countify-oficial/tokens";
import { useState, type ReactNode } from "react";
import { Textarea, type TextareaProps } from "../Textarea/Textarea";

export type JsonInputProps = TextareaProps & {
  formatOnBlur?: boolean | undefined;
  validationError?: ReactNode;
};

const valido = (t: string) => {
  if (t.trim() === "") return true;
  try {
    JSON.parse(t);
    return true;
  } catch {
    return false;
  }
};

/** Campo de JSON: confere ao sair do campo e pode reorganizar o texto. */
export function JsonInput(props: JsonInputProps) {
  const messages = useMessages();
  const { formatOnBlur, validationError = messages.invalidJson, error, onBlur, onChangeText, value, defaultValue, inputStyle, ...rest } = useComponentProps("JsonInput", {}, props);
  const [texto, setTexto] = useState(value ?? defaultValue ?? "");
  const [invalido, setInvalido] = useState(false);
  const atual = value ?? texto;
  return (
    <Textarea
      autoCapitalize="none"
      autoCorrect={false}
      {...rest}
      value={atual}
      onChangeText={(t) => {
        setTexto(t);
        onChangeText?.(t);
      }}
      onBlur={(e) => {
        const ok = valido(atual);
        setInvalido(!ok);
        if (ok && formatOnBlur && atual.trim() !== "") setTexto(JSON.stringify(JSON.parse(atual), null, 2));
        onBlur?.(e);
      }}
      error={error ?? (invalido ? validationError : undefined)}
      inputStyle={[{ fontFamily: nativeMonoFontFamily[400] }, inputStyle]}
    />
  );
}
