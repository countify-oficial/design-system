import { useControllableState } from "@countify-oficial/hooks";
import { filterCombobox, mentionQuery, parseComboboxData, useComponentProps, type ComboboxData } from "@countify-oficial/provider";
import { useId, useMemo, useState, type ChangeEvent, type SyntheticEvent } from "react";
import { Combobox } from "../Combobox/Combobox";
import { ComboboxOptions } from "../Combobox/Options";
import { InputBase, type InputBaseOwnProps, type InputBaseProps } from "../Input/Input";
import type { PolymorphicProps } from "../polymorphic";

export type MentionsProps = PolymorphicProps<
  "textarea",
  InputBaseOwnProps & {
    /** Quem (ou o que) pode ser mencionado. */
    data: ComboboxData;
    value?: string | undefined;
    defaultValue?: string | undefined;
    onChange?: ((value: string) => void) | undefined;
    /** O que abre a lista. Padrão: "@". */
    prefix?: string | undefined;
    /** Quantas opções mostrar. Padrão: 6. */
    limit?: number | undefined;
    /** Linhas. Padrão: 3. */
    minRows?: number | undefined;
  }
>;

/** Campo de texto com menções: "@" abre a lista de pessoas; Enter (ou clique) põe "@Nome " no texto. */
export function Mentions(props: MentionsProps) {
  const { data, value, defaultValue, onChange, prefix = "@", limit = 6, minRows = 3, ...rest } = useComponentProps("Mentions", {}, props);
  const grupos = useMemo(() => parseComboboxData(data), [data]);
  const [texto, setTexto] = useControllableState({ value, defaultValue: defaultValue ?? "", onChange });
  const [cursor, setCursor] = useState(0);
  const [campo, setCampo] = useState<HTMLTextAreaElement | null>(null);
  const autoId = useId();
  const id = rest.id ?? autoId;
  const consulta = mentionQuery(texto, cursor, prefix);
  const opcoes = consulta ? filterCombobox(grupos, consulta.busca, limit) : [];
  const lerCursor = (e: SyntheticEvent<HTMLTextAreaElement>) => setCursor(e.currentTarget.selectionStart);
  // Esc ou sair do campo dispensa a lista desta menção (pelo "@" onde ela começa); outra menção abre de novo
  const [dispensada, setDispensada] = useState<number | null>(null);
  return (
    <Combobox
      opened={opcoes.length > 0 && consulta?.inicio !== dispensada}
      onOpenedChange={(aberto) => {
        if (!aberto) setDispensada(consulta?.inicio ?? null);
      }}
      onOptionSubmit={(v) => {
        if (!consulta) return;
        const rotulo = opcoes.flatMap((g) => g.items).find((i) => i.value === v)?.label ?? v;
        const novo = `${texto.slice(0, consulta.inicio)}${prefix}${rotulo} ${texto.slice(cursor)}`;
        const pos = consulta.inicio + prefix.length + rotulo.length + 1;
        setTexto(novo);
        setCursor(pos);
        requestAnimationFrame(() => campo?.setSelectionRange(pos, pos));
      }}
    >
      <Combobox.Target>
        <CampoDeMencao
          rows={minRows}
          data-multiline
          {...rest}
          ref={setCampo}
          id={id}
          value={texto}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
            setTexto(e.currentTarget.value);
            setCursor(e.currentTarget.selectionStart);
            if (!mentionQuery(e.currentTarget.value, e.currentTarget.selectionStart, prefix)) setDispensada(null);
          }}
          onSelect={lerCursor}
          onClick={lerCursor}
        />
      </Combobox.Target>
      <Combobox.Dropdown aria-labelledby={rest.label ? `${id}-label` : undefined} aria-label={rest.label ? undefined : rest["aria-label"]}>
        <ComboboxOptions grupos={opcoes} escolhidos={[]} withCheckIcon={false} />
      </Combobox.Dropdown>
    </Combobox>
  );
}

/** textarea não pode ter role combobox nem aria-expanded (ARIA): fica caixa de texto com aria-controls e aria-activedescendant. */
function CampoDeMencao({ role: _papel, "aria-expanded": _aberto, ...props }: InputBaseProps<"textarea">) {
  return <InputBase {...props} component="textarea" />;
}
