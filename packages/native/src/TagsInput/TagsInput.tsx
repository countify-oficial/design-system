import { useControllableState } from "@countify-oficial/hooks";
import { normalizeSearch, useComponentProps } from "@countify-oficial/provider";
import { useState } from "react";
import { Pill } from "../Pill/Pill";
import { PillsInput, type PillsInputProps } from "../PillsInput/PillsInput";

export interface TagsInputProps extends Omit<PillsInputProps, "children"> {
  value?: string[] | undefined;
  defaultValue?: string[] | undefined;
  onChange?: ((value: string[]) => void) | undefined;
  maxTags?: number | undefined;
  allowDuplicates?: boolean | undefined;
  /** Padrão: vírgula. */
  splitChars?: string[] | undefined;
  placeholder?: string | undefined;
}

/** Etiquetas livres: "OK" do teclado (ou vírgula) cria; apagar no campo vazio tira a última. */
export function TagsInput(props: TagsInputProps) {
  const { value, defaultValue, onChange, maxTags, allowDuplicates, splitChars = [","], placeholder, disabled, ...rest } = useComponentProps("TagsInput", {}, props);
  const [tags, setTags] = useControllableState<string[]>({ value, defaultValue: defaultValue ?? [], onChange });
  const [busca, setBusca] = useState("");
  const adicionar = (lista: string[]) => {
    const novas = [...tags];
    for (const bruto of lista) {
      const t = bruto.trim();
      if (!t || (maxTags !== undefined && novas.length >= maxTags)) continue;
      if (!allowDuplicates && novas.some((x) => normalizeSearch(x) === normalizeSearch(t))) continue;
      novas.push(t);
    }
    if (novas.length !== tags.length) setTags(novas);
    setBusca("");
  };
  const separador = new RegExp(`[${splitChars.map((c) => c.replace(/[\]\\^-]/g, "\\$&")).join("")}]`);
  return (
    <PillsInput {...rest} disabled={disabled}>
      {tags.map((t, i) => <Pill key={`${t}-${i}`} withRemoveButton disabled={disabled} onRemove={() => setTags(tags.filter((_, k) => k !== i))}>{t}</Pill>)}
      <PillsInput.Field
        value={busca}
        placeholder={tags.length === 0 ? placeholder : undefined}
        submitBehavior="submit"
        returnKeyType="done"
        onChangeText={(t) => {
          if (splitChars.length > 0 && separador.test(t)) {
            const partes = t.split(separador);
            adicionar(partes.slice(0, -1));
            setBusca(partes.at(-1) ?? "");
          } else setBusca(t);
        }}
        onSubmitEditing={() => adicionar([busca])}
        onKeyPress={(e) => {
          if (e.nativeEvent.key === "Backspace" && busca === "" && tags.length > 0) setTags(tags.slice(0, -1));
        }}
      />
    </PillsInput>
  );
}
