import { useControllableState } from "@countify-oficial/hooks";
import { useComponentProps, useMessages } from "@countify-oficial/provider";
import { useState, type ChangeEvent, type KeyboardEvent } from "react";
import { CloseButton } from "../CloseButton/CloseButton";
import { Icon } from "../Icon/Icon";
import { InputBase, type InputBaseOwnProps } from "../Input/Input";
import type { PolymorphicProps } from "../polymorphic";
import { Popover } from "../Popover/Popover";
import type { TreeNode } from "../Tree/data";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";
import classes from "./Cascader.module.css";

export type CascaderProps = PolymorphicProps<
  "input",
  Omit<InputBaseOwnProps, "rightSection"> & {
    data: TreeNode[];
    /** O caminho escolhido (os valores do primeiro nível até o último). */
    value?: string[] | undefined;
    defaultValue?: string[] | undefined;
    onChange?: ((path: string[], nodes: TreeNode[]) => void) | undefined;
    /** Aceita escolher um pai (não só a última camada). */
    changeOnSelect?: boolean | undefined;
    clearable?: boolean | undefined;
    /** Entre os rótulos no campo. Padrão: " / ". */
    separator?: string | undefined;
  }
>;

/** Escolhe por camadas (estado → cidade → loja): uma coluna por camada. Setas andam; direita entra; esquerda volta. */
export function Cascader(props: CascaderProps) {
  const messages = useMessages();
  const { data, value, defaultValue, onChange, changeOnSelect, clearable, separator = " / ", disabled, ...rest } = useComponentProps("Cascader", {}, props);
  const [caminho, setCaminho] = useControllableState<string[]>({ value, defaultValue: defaultValue ?? [], onChange: (p) => onChange?.(p, nos(p)) });
  const [aberto, setAberto] = useState(false);
  const [rascunho, setRascunho] = useState<string[]>([]);
  function nos(p: string[]): TreeNode[] {
    const lista: TreeNode[] = [];
    let nivel: TreeNode[] | undefined = data;
    for (const v of p) {
      const no: TreeNode | undefined = nivel?.find((n) => n.value === v);
      if (!no) break;
      lista.push(no);
      nivel = no.children;
    }
    return lista;
  }
  const colunas: TreeNode[][] = [data];
  for (const no of nos(rascunho)) if (no.children?.length) colunas.push(no.children);
  const escolher = (nivel: number, no: TreeNode) => {
    if (no.disabled) return;
    const novo = [...rascunho.slice(0, nivel), no.value];
    setRascunho(novo);
    if (!no.children?.length || changeOnSelect) setCaminho(novo);
    if (!no.children?.length) setAberto(false);
  };
  const aoTeclar = (e: KeyboardEvent<HTMLElement>, nivel: number, i: number) => {
    const col = e.currentTarget.closest("[data-coluna]");
    const botoes = (n: number) => Array.from(col?.parentElement?.querySelectorAll<HTMLElement>(`[data-coluna="${n}"] button`) ?? []);
    const aqui = botoes(nivel);
    const no = colunas[nivel]?.[i];
    const acoes: Record<string, () => void> = {
      ArrowDown: () => aqui[(i + 1) % aqui.length]?.focus(),
      ArrowUp: () => aqui[(i - 1 + aqui.length) % aqui.length]?.focus(),
      ArrowRight: () => {
        if (no?.children?.length) {
          escolher(nivel, no);
          requestAnimationFrame(() => botoes(nivel + 1)[0]?.focus());
        }
      },
      ArrowLeft: () => {
        if (nivel === 0) return;
        const pai = rascunho[nivel - 1];
        setRascunho(rascunho.slice(0, nivel));
        const k = colunas[nivel - 1]?.findIndex((n) => n.value === pai) ?? 0;
        botoes(nivel - 1)[k]?.focus();
      },
    };
    const acao = acoes[e.key];
    if (!acao) return;
    e.preventDefault();
    acao();
  };
  return (
    <Popover
      opened={aberto && !disabled}
      onChange={(v) => {
        setAberto(v);
        if (v) setRascunho(caminho);
      }}
      position="bottom-start"
      trapFocus
    >
      <Popover.Target>
        <InputBase
          {...rest}
          component="input"
          // abre um seletor: o padrão "date picker combobox" do WAI-ARIA (textbox não aceita aria-expanded)
          role="combobox"
          readOnly
          disabled={disabled}
          value={nos(caminho).map((n) => n.label).join(separator)}
          onChange={(_e: ChangeEvent<HTMLInputElement>) => undefined}
          rightSection={clearable && caminho.length > 0 ? <CloseButton aria-label={messages.clear} color="text2" onClick={() => setCaminho([])} /> : <Icon name="chevron-down" />}
          rightSectionPointerEvents={clearable && caminho.length > 0 ? "auto" : "none"}
        />
      </Popover.Target>
      <Popover.Dropdown aria-label={typeof rest.label === "string" ? rest.label : undefined} style={{ padding: 0 }}>
        <div className={classes["columns"]}>
          {colunas.map((coluna, nivel) => (
            <ul key={nivel} data-coluna={nivel} className={classes["column"]}>
              {coluna.map((no, i) => (
                <li key={no.value}>
                  <UnstyledButton
                    className={classes["option"]}
                    aria-current={caminho[nivel] === no.value || undefined}
                    aria-haspopup={no.children?.length ? "true" : undefined}
                    data-open={rascunho[nivel] === no.value && no.children?.length ? true : undefined}
                    disabled={no.disabled}
                    onClick={() => escolher(nivel, no)}
                    onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => aoTeclar(e, nivel, i)}
                  >
                    <span className={classes["optionLabel"]}>{no.label}</span>
                    {no.children?.length ? <span className={classes["arrow"]}><Icon name="chevron-right" size="sm" /></span> : null}
                  </UnstyledButton>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </Popover.Dropdown>
    </Popover>
  );
}
