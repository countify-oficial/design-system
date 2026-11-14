import { useControllableState, useId } from "@countify-oficial/hooks";
import { hasContent, useComponentProps } from "@countify-oficial/provider";
import { createContext, useContext, type ChangeEvent, type ComponentPropsWithRef, type ReactNode } from "react";
import { ChoiceGroup, type ChoiceGroupOwnProps } from "../ChoiceGroup/ChoiceGroup";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./Switch.module.css";

export interface SwitchProps
  extends StylesApiProps<"root" | "track" | "thumb" | "input" | "body" | "label" | "description">, Omit<ComponentPropsWithRef<"input">, "className" | "style" | "size" | "type"> {
  label?: ReactNode;
  description?: ReactNode;
  /** Rótulo à esquerda e o interruptor no fim da linha (o do mockup), ou à direita. Padrão: left. */
  labelPosition?: "left" | "right" | undefined;
}

const GrupoDeInterruptores = createContext<{ valor: string[]; alternar: (v: string) => void } | null>(null);

/** Interruptor: aplica na hora, sem salvar (identidade). É um checkbox com papel switch. */
export function SwitchItem(props: SwitchProps) {
  const grupo = useContext(GrupoDeInterruptores);
  const { label, description, labelPosition = "left", id, checked, onChange, value, disabled, className, style, classNames, styles, ...rest } = useComponentProps("Switch", {}, props);
  const getStyles = useStyles("Switch", classes, { className, style, classNames, styles });
  const campo = useId(id);
  const doGrupo = grupo && value !== undefined
    ? { checked: grupo.valor.includes(String(value)), onChange: (e: ChangeEvent<HTMLInputElement>) => { grupo.alternar(String(value)); onChange?.(e); } }
    : { checked, onChange };
  return (
    <div data-label-position={labelPosition} data-disabled={disabled || undefined} {...getStyles("root")}>
      <span {...getStyles("track")}>
        <input id={campo} type="checkbox" role="switch" value={value} disabled={disabled} aria-describedby={hasContent(description) ? `${campo}-description` : undefined} {...rest} {...doGrupo} {...getStyles("input")} />
        <span aria-hidden {...getStyles("thumb")} />
      </span>
      {(hasContent(label) || hasContent(description)) && (
        <div {...getStyles("body")}>
          {hasContent(label) && <label htmlFor={campo} {...getStyles("label")}>{label}</label>}
          {hasContent(description) && <span id={`${campo}-description`} {...getStyles("description")}>{description}</span>}
        </div>
      )}
    </div>
  );
}

export type SwitchGroupProps = ChoiceGroupOwnProps &
  Omit<ComponentPropsWithRef<"div">, keyof ChoiceGroupOwnProps | "className" | "style" | "onChange" | "defaultValue" | "role"> & {
    value?: string[] | undefined;
    defaultValue?: string[] | undefined;
    onChange?: ((value: string[]) => void) | undefined;
  };

/** Grupo de interruptores: guarda a lista dos ligados. */
export function SwitchGroup(props: SwitchGroupProps) {
  const { value, defaultValue, onChange, ...rest } = useComponentProps("SwitchGroup", {}, props);
  const [valor, setValor] = useControllableState<string[]>({ value, defaultValue: defaultValue ?? [], onChange });
  return (
    <GrupoDeInterruptores value={{ valor, alternar: (v) => setValor(valor.includes(v) ? valor.filter((x) => x !== v) : [...valor, v]) }}>
      <ChoiceGroup name="SwitchGroup" role="group" {...rest} />
    </GrupoDeInterruptores>
  );
}

/** Interruptor. Switch.Group agrupa. */
export const Switch = Object.assign(SwitchItem, { Group: SwitchGroup });
