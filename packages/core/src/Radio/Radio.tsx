import { useControllableState, useId } from "@countify-oficial/hooks";
import { useComponentProps } from "@countify-oficial/provider";
import type { Size } from "@countify-oficial/tokens";
import { createContext, useContext, type ChangeEvent, type ComponentPropsWithRef, type ReactNode } from "react";
import classes from "../Checkbox/Checkbox.module.css";
import { ChoiceGroup, type ChoiceGroupOwnProps } from "../ChoiceGroup/ChoiceGroup";
import { useStyles, type StylesApiProps } from "../styles";

export interface RadioProps
  extends StylesApiProps<"root" | "input" | "body" | "label" | "description" | "error">, Omit<ComponentPropsWithRef<"input">, "className" | "style" | "size" | "type"> {
  label?: ReactNode;
  description?: ReactNode;
  /** Lado do círculo, o dos ícones. Padrão: md (22). */
  size?: Size | undefined;
  labelPosition?: "right" | "left" | undefined;
}

const GrupoDeRadios = createContext<{ valor: string | null; escolher: (v: string) => void; nome: string } | null>(null);

/** Opção de escolha única. Dentro de Radio.Group, escolhe pelo value. */
export function RadioItem(props: RadioProps) {
  const grupo = useContext(GrupoDeRadios);
  const { label, description, size = "md", labelPosition = "right", id, checked, onChange, value, name, disabled, className, style, classNames, styles, ...rest } =
    useComponentProps("Radio", {}, props);
  const getStyles = useStyles("Radio", classes, { className, style, classNames, styles });
  const campo = useId(id);
  const doGrupo = grupo && value !== undefined
    ? { name: grupo.nome, checked: grupo.valor === String(value), onChange: (e: ChangeEvent<HTMLInputElement>) => { grupo.escolher(String(value)); onChange?.(e); } }
    : { name, checked, onChange };
  const tem = (v: ReactNode) => v !== undefined && v !== null && v !== false && v !== "";
  return (
    <div data-label-position={labelPosition} data-disabled={disabled || undefined} {...getStyles("root", { "--check-size": `var(--cf-icon-size-${size})` })}>
      <input id={campo} type="radio" value={value} disabled={disabled} aria-describedby={tem(description) ? `${campo}-description` : undefined} {...rest} {...doGrupo} {...getStyles("input")} />
      {(tem(label) || tem(description)) && (
        <div {...getStyles("body")}>
          {tem(label) && <label htmlFor={campo} {...getStyles("label")}>{label}</label>}
          {tem(description) && <span id={`${campo}-description`} {...getStyles("description")}>{description}</span>}
        </div>
      )}
    </div>
  );
}

export type RadioGroupProps = ChoiceGroupOwnProps &
  Omit<ComponentPropsWithRef<"div">, keyof ChoiceGroupOwnProps | "className" | "style" | "onChange" | "defaultValue" | "role"> & {
    value?: string | null | undefined;
    defaultValue?: string | null | undefined;
    onChange?: ((value: string) => void) | undefined;
    /** name dos radios (formulários). Padrão: um id. */
    name?: string | undefined;
  };

/** Grupo de opções de escolha única (setas do teclado andam entre elas). */
export function RadioGroup(props: RadioGroupProps) {
  const { value, defaultValue, onChange, name, ...rest } = useComponentProps("RadioGroup", {}, props);
  const nome = useId(name);
  const [valor, setValor] = useControllableState<string | null>({ value, defaultValue: defaultValue ?? null, onChange: (v) => v !== null && onChange?.(v) });
  return (
    <GrupoDeRadios value={{ valor, escolher: setValor, nome }}>
      <ChoiceGroup name="RadioGroup" role="radiogroup" {...rest} />
    </GrupoDeRadios>
  );
}

/** Opção de escolha única. Radio.Group agrupa. */
export const Radio = Object.assign(RadioItem, { Group: RadioGroup });
