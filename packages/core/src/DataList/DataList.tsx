import { useComponentProps } from "@countify-oficial/provider";
import type { Tone } from "@countify-oficial/tokens";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { toneVars, useStyles, type StylesApiProps } from "../styles";
import classes from "./DataList.module.css";

export type DataListProps = StylesApiProps & Omit<ComponentPropsWithRef<"dl">, "className" | "style">;

export interface DataListItemProps extends StylesApiProps<"root" | "label" | "value">, Omit<ComponentPropsWithRef<"div">, "className" | "style" | "color"> {
  /** O termo ("Ticket médio"). */
  label: ReactNode;
  /** O valor ("R$ 87,40"); ou passe nos filhos. */
  value?: ReactNode;
  /** Tom do valor (up, down…). Sem ele, a cor do texto. */
  color?: Tone | undefined;
  children?: ReactNode;
}

/** Um par termo–valor do DataList. */
export function DataListItem(props: DataListItemProps) {
  const { label, value, color, children, className, style, classNames, styles, ...rest } = useComponentProps("DataListItem", {}, props);
  const getStyles = useStyles(
    "DataListItem",
    { root: classes["item"] ?? "", label: classes["label"] ?? "", value: classes["value"] ?? "" },
    { className, style, classNames, styles },
  );
  return (
    <div {...rest} {...getStyles("root")}>
      <dt {...getStyles("label")}>{label}</dt>
      <dd data-color={color} {...getStyles("value", color ? toneVars(color) : undefined)}>{value ?? children}</dd>
    </div>
  );
}

function DataListRoot(props: DataListProps) {
  const { className, style, classNames, styles, ...rest } = useComponentProps("DataList", {}, props);
  const getStyles = useStyles("DataList", classes, { className, style, classNames, styles });
  return <dl {...rest} {...getStyles("root")} />;
}

/** Pares de dados: termo à esquerda, valor à direita (<dl>). Os pares são DataList.Item. */
export const DataList = Object.assign(DataListRoot, { Item: DataListItem });
