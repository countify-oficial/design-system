import { useControllableState, useId } from "@countify-oficial/hooks";
import { useComponentProps } from "@countify-oficial/provider";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./SegmentedControl.module.css";

export interface SegmentedControlItem {
  value: string;
  label: ReactNode;
  disabled?: boolean | undefined;
}

export interface SegmentedControlProps
  extends StylesApiProps<"root" | "control" | "input" | "label">, Omit<ComponentPropsWithRef<"div">, "className" | "style" | "onChange" | "defaultValue"> {
  /** De 2 a 4 opções exclusivas (identidade): textos ou { value, label, disabled }. */
  data: (string | SegmentedControlItem)[];
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  /** Ocupa a largura toda, com as opções do mesmo tamanho. */
  fullWidth?: boolean | undefined;
  name?: string | undefined;
  disabled?: boolean | undefined;
}

/** Segmentado: de 2 a 4 opções exclusivas lado a lado (Todos · Pessoas · Sistema). Setas andam entre elas. */
export function SegmentedControl(props: SegmentedControlProps) {
  const { data, value, defaultValue, onChange, fullWidth, name, disabled, className, style, classNames, styles, ...rest } = useComponentProps("SegmentedControl", {}, props);
  const getStyles = useStyles("SegmentedControl", classes, { className, style, classNames, styles });
  const itens = data.map((d) => (typeof d === "string" ? { value: d, label: d } : d));
  const nome = useId(name);
  const [valor, setValor] = useControllableState({ value, defaultValue: defaultValue ?? itens[0]?.value ?? "", onChange });
  return (
    <div role="radiogroup" {...rest} data-full-width={fullWidth || undefined} {...getStyles("root", { "--seg-count": itens.length })}>
      {itens.map((item) => {
        const id = `${nome}-${item.value}`;
        return (
          <div key={item.value} {...getStyles("control")}>
            <input
              id={id}
              type="radio"
              name={nome}
              value={item.value}
              checked={valor === item.value}
              disabled={disabled || item.disabled}
              onChange={() => setValor(item.value)}
              {...getStyles("input")}
            />
            <label htmlFor={id} {...getStyles("label")}>{item.label}</label>
          </div>
        );
      })}
    </div>
  );
}
