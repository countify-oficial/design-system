import { useControllableState, useId } from "@countify-oficial/hooks";
import { useComponentProps } from "@countify-oficial/provider";
import type { Size } from "@countify-oficial/tokens";
import { createContext, useContext, useEffect, type ChangeEvent, type ComponentPropsWithRef, type ReactNode } from "react";
import { ChoiceGroup, type ChoiceGroupOwnProps } from "../ChoiceGroup/ChoiceGroup";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./Checkbox.module.css";

export interface CheckboxProps
  extends StylesApiProps<"root" | "input" | "body" | "label" | "description" | "error">, Omit<ComponentPropsWithRef<"input">, "className" | "style" | "size" | "type"> {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  /** Meio marcado (o "Selecionar todos" com só alguns). */
  indeterminate?: boolean | undefined;
  /** Lado da caixa, o dos ícones: xs 16, sm 18, md 22, lg 28, xl 32. Padrão: md (22, o do mockup). */
  size?: Size | undefined;
  /** Rótulo à direita (padrão) ou à esquerda, com a caixa no fim da linha. */
  labelPosition?: "right" | "left" | undefined;
}

interface Grupo {
  valor: string[];
  alternar: (v: string) => void;
}
const GrupoDeCaixas = createContext<Grupo | null>(null);

/** Caixa de marcar com rótulo. Dentro de Checkbox.Group, marca pelo value. */
export function CheckboxItem(props: CheckboxProps) {
  const grupo = useContext(GrupoDeCaixas);
  const { label, description, error, indeterminate, size = "md", labelPosition = "right", id, checked, onChange, value, disabled, className, style, classNames, styles, ...rest } =
    useComponentProps("Checkbox", {}, props);
  const getStyles = useStyles("Checkbox", classes, { className, style, classNames, styles });
  const campo = useId(id);
  // indeterminate não é atributo do HTML: só pela propriedade do elemento
  useEffect(() => {
    const el = document.getElementById(campo);
    if (el instanceof HTMLInputElement) el.indeterminate = !!indeterminate;
  }, [campo, indeterminate]);
  const doGrupo = grupo && value !== undefined ? { checked: grupo.valor.includes(String(value)), onChange: (e: ChangeEvent<HTMLInputElement>) => { grupo.alternar(String(value)); onChange?.(e); } } : { checked, onChange };
  const tem = (v: ReactNode) => v !== undefined && v !== null && v !== false && v !== "";
  return (
    <div data-label-position={labelPosition} data-disabled={disabled || undefined} {...getStyles("root", { "--check-size": `var(--cf-icon-size-${size})` })}>
      <input
        id={campo}
        type="checkbox"
        value={value}
        disabled={disabled}
        aria-invalid={tem(error) || undefined}
        aria-describedby={[tem(description) && `${campo}-description`, tem(error) && `${campo}-error`].filter(Boolean).join(" ") || undefined}
        {...rest}
        {...doGrupo}
        {...getStyles("input")}
      />
      {(tem(label) || tem(description) || tem(error)) && (
        <div {...getStyles("body")}>
          {tem(label) && <label htmlFor={campo} {...getStyles("label")}>{label}</label>}
          {tem(description) && <span id={`${campo}-description`} {...getStyles("description")}>{description}</span>}
          {tem(error) && <span id={`${campo}-error`} {...getStyles("error")}>{error}</span>}
        </div>
      )}
    </div>
  );
}

export type CheckboxGroupProps = ChoiceGroupOwnProps &
  Omit<ComponentPropsWithRef<"div">, keyof ChoiceGroupOwnProps | "className" | "style" | "onChange" | "defaultValue" | "role"> & {
    /** Os values marcados (controlado). */
    value?: string[] | undefined;
    defaultValue?: string[] | undefined;
    onChange?: ((value: string[]) => void) | undefined;
  };

/** Grupo de caixas: guarda a lista dos marcados. */
export function CheckboxGroup(props: CheckboxGroupProps) {
  const { value, defaultValue, onChange, ...rest } = useComponentProps("CheckboxGroup", {}, props);
  const [valor, setValor] = useControllableState<string[]>({ value, defaultValue: defaultValue ?? [], onChange });
  const alternar = (v: string) => setValor(valor.includes(v) ? valor.filter((x) => x !== v) : [...valor, v]);
  return (
    <GrupoDeCaixas value={{ valor, alternar }}>
      <ChoiceGroup name="CheckboxGroup" role="group" {...rest} />
    </GrupoDeCaixas>
  );
}

/** Estado do "Selecionar todos" para uma lista: all, none ou some (meio marcado). */
export const selectAllState = (todos: string[], marcados: string[]): "all" | "none" | "some" =>
  marcados.length === 0 ? "none" : todos.every((t) => marcados.includes(t)) ? "all" : "some";

/** Caixa de marcar. Checkbox.Group agrupa e guarda os marcados. */
export const Checkbox = Object.assign(CheckboxItem, { Group: CheckboxGroup });
