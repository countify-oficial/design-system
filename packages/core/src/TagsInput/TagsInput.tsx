import { useControllableState } from "@countify-oficial/hooks";
import { useComponentProps, useMessages } from "@countify-oficial/provider";
import { useMemo, useState, type ComponentPropsWithRef, type KeyboardEvent } from "react";
import { CloseButton } from "../CloseButton/CloseButton";
import { Combobox } from "../Combobox/Combobox";
import { filterCombobox, normalizeSearch, parseComboboxData, type ComboboxData } from "../Combobox/data";
import { ComboboxOptions } from "../Combobox/Options";
import { Pill } from "../Pill/Pill";
import { PillsInput, type PillsInputProps } from "../PillsInput/PillsInput";

export interface TagsInputProps extends Omit<PillsInputProps, "onChange" | "defaultValue" | "rightSection" | "children"> {
  /** Sugestões (as já usadas somem da lista). */
  data?: ComboboxData | undefined;
  value?: string[] | undefined;
  defaultValue?: string[] | undefined;
  onChange?: ((value: string[]) => void) | undefined;
  /** No máximo quantas. */
  maxTags?: number | undefined;
  /** Aceita repetidas (sem diferenciar acento e maiúsculas). Padrão: false. */
  allowDuplicates?: boolean | undefined;
  /** Caracteres que fecham uma etiqueta ao digitar. Padrão: vírgula. */
  splitChars?: string[] | undefined;
  clearable?: boolean | undefined;
  placeholder?: string | undefined;
  limit?: number | undefined;
  inputProps?: ComponentPropsWithRef<"input"> | undefined;
}

/** Campo de etiquetas livres: Enter (ou vírgula) cria; Backspace no campo vazio tira a última. */
export function TagsInput(props: TagsInputProps) {
  const messages = useMessages();
  const { data = [], value, defaultValue, onChange, maxTags, allowDuplicates, splitChars = [","], clearable, placeholder, limit, inputProps, disabled, ...rest } = useComponentProps("TagsInput", {}, props);
  const grupos = useMemo(() => parseComboboxData(data), [data]);
  const [tags, setTags] = useControllableState<string[]>({ value, defaultValue: defaultValue ?? [], onChange });
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState(false);
  const repetida = (t: string) => tags.some((x) => normalizeSearch(x) === normalizeSearch(t));
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
  const sugestoes = filterCombobox(grupos.map((g) => ({ ...g, items: g.items.filter((i) => allowDuplicates || !repetida(i.value)) })), busca, limit);
  const separador = new RegExp(`[${splitChars.map((c) => c.replace(/[\]\\^-]/g, "\\$&")).join("")}]`);
  return (
    <Combobox opened={aberto && sugestoes.length > 0 && !disabled} onOpenedChange={setAberto} disabled={disabled} onOptionSubmit={(v) => adicionar([v])}>
      <Combobox.Anchor>
        <PillsInput {...rest} disabled={disabled} rightSection={clearable && tags.length > 0 ? <CloseButton aria-label={messages.clear} color="text2" onClick={() => setTags([])} /> : undefined}>
          {tags.map((t, i) => (
            <Pill key={`${t}-${i}`} withRemoveButton disabled={disabled} onRemove={() => setTags(tags.filter((_, k) => k !== i))}>{t}</Pill>
          ))}
          <Combobox.Target>
            <PillsInput.Field
              {...inputProps}
              value={busca}
              placeholder={tags.length === 0 ? placeholder : undefined}
              onChange={(e) => {
                const t = e.currentTarget.value;
                if (splitChars.length > 0 && separador.test(t)) {
                  const partes = t.split(separador);
                  adicionar(partes.slice(0, -1));
                  setBusca(partes.at(-1) ?? "");
                } else setBusca(t);
                setAberto(true);
              }}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter" && busca.trim() !== "" && !e.defaultPrevented) {
                  e.preventDefault();
                  adicionar([busca]);
                } else if (e.key === "Backspace" && busca === "" && tags.length > 0) setTags(tags.slice(0, -1));
              }}
              onBlur={() => busca.trim() !== "" && adicionar([busca])}
            />
          </Combobox.Target>
        </PillsInput>
      </Combobox.Anchor>
      <Combobox.Dropdown>
        <ComboboxOptions grupos={sugestoes} escolhidos={[]} withCheckIcon={false} />
      </Combobox.Dropdown>
    </Combobox>
  );
}
