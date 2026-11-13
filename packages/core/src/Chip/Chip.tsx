import { useControllableState, useId } from "@countify-oficial/hooks";
import { useComponentProps } from "@countify-oficial/provider";
import type { Size } from "@countify-oficial/tokens";
import { createContext, useContext, type ChangeEvent, type ComponentPropsWithRef, type ReactNode } from "react";
import { ChoiceGroup, type ChoiceGroupOwnProps } from "../ChoiceGroup/ChoiceGroup";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./Chip.module.css";

export interface ChipProps extends StylesApiProps<"root" | "input" | "label">, Omit<ComponentPropsWithRef<"input">, "className" | "style" | "size" | "type"> {
  /** checkbox (vários) ou radio (um só). Padrão: checkbox; dentro de Chip.Group, o do grupo. */
  type?: "checkbox" | "radio" | undefined;
  /** Canto. Padrão: sm (12). */
  radius?: Size | undefined;
  children?: ReactNode;
}

const GrupoDeChips = createContext<{ valor: string[]; multiplo: boolean; alternar: (v: string) => void; nome: string } | null>(null);

/** Chip de escolha: marca e desmarca, com o visual do mockup. */
export function ChipItem(props: ChipProps) {
  const grupo = useContext(GrupoDeChips);
  const { type, radius = "sm", id, checked, onChange, value, name, children, className, style, classNames, styles, ...rest } = useComponentProps("Chip", {}, props);
  const getStyles = useStyles("Chip", classes, { className, style, classNames, styles });
  const campo = useId(id);
  const doGrupo = grupo && value !== undefined
    ? {
        type: grupo.multiplo ? ("checkbox" as const) : ("radio" as const),
        name: grupo.nome,
        checked: grupo.valor.includes(String(value)),
        onChange: (e: ChangeEvent<HTMLInputElement>) => { grupo.alternar(String(value)); onChange?.(e); },
      }
    : { type: type ?? "checkbox", name, checked, onChange };
  return (
    <span {...getStyles("root", { "--chip-radius": `var(--cf-radius-${radius})` })}>
      <input id={campo} value={value} {...rest} {...doGrupo} {...getStyles("input")} />
      <label htmlFor={campo} {...getStyles("label")}>{children}</label>
    </span>
  );
}

export type ChipGroupProps = ChoiceGroupOwnProps &
  Omit<ComponentPropsWithRef<"div">, keyof ChoiceGroupOwnProps | "className" | "style" | "onChange" | "defaultValue" | "role"> & {
    /** Vários escolhidos (checkbox) ou um só (radio). Padrão: false. */
    multiple?: boolean | undefined;
    value?: string[] | undefined;
    defaultValue?: string[] | undefined;
    onChange?: ((value: string[]) => void) | undefined;
  };

/** Grupo de chips em linha (os "Chips de escolha" do mockup). */
export function ChipGroup(props: ChipGroupProps) {
  const { multiple = false, value, defaultValue, onChange, orientation = "row", ...rest } = useComponentProps("ChipGroup", {}, props);
  const nome = useId();
  const [valor, setValor] = useControllableState<string[]>({ value, defaultValue: defaultValue ?? [], onChange });
  const alternar = (v: string) => setValor(multiple ? (valor.includes(v) ? valor.filter((x) => x !== v) : [...valor, v]) : [v]);
  return (
    <GrupoDeChips value={{ valor, multiplo: multiple, alternar, nome }}>
      <ChoiceGroup name="ChipGroup" role={multiple ? "group" : "radiogroup"} orientation={orientation} {...rest} />
    </GrupoDeChips>
  );
}

/** Chip de escolha. Chip.Group agrupa (um ou vários). */
export const Chip = Object.assign(ChipItem, { Group: ChipGroup });
