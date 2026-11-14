import { useId } from "@countify-oficial/hooks";
import { hasContent } from "@countify-oficial/provider";
import type { Spacing } from "@countify-oficial/tokens";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { spacingVar, useStyles, type StylesApiProps } from "../styles";
import classes from "./ChoiceGroup.module.css";

export interface ChoiceGroupOwnProps extends StylesApiProps<"root" | "label" | "description" | "error" | "items"> {
  /** Título do grupo. */
  label?: ReactNode;
  description?: ReactNode;
  /** Mensagem de erro, anunciada. */
  error?: ReactNode;
  /** Itens em coluna (column) ou em linha (row). Padrão: column. */
  orientation?: "column" | "row" | undefined;
  /** Espaço entre os itens. Padrão: sm (8). */
  gap?: Spacing | undefined;
}

type Props = ChoiceGroupOwnProps & Omit<ComponentPropsWithRef<"div">, keyof ChoiceGroupOwnProps | "className" | "style"> & { name: string; role: "group" | "radiogroup" };

/** Moldura dos grupos de escolha (Checkbox.Group, Radio.Group, Switch.Group, Chip.Group): título, ajuda e erro. */
export function ChoiceGroup({ name, role, label, description, error, orientation = "column", gap = "sm", children, id, className, style, classNames, styles, ...rest }: Props) {
  const getStyles = useStyles(name, classes, { className, style, classNames, styles });
  const base = useId(id);
  const descrito = [hasContent(description) && `${base}-description`, hasContent(error) && `${base}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div id={base} role={role} aria-labelledby={hasContent(label) ? `${base}-label` : undefined} aria-describedby={descrito} aria-invalid={!!error || undefined} {...rest} {...getStyles("root")}>
      {hasContent(label) && <div id={`${base}-label`} {...getStyles("label")}>{label}</div>}
      <div {...getStyles("items", { "--group-direction": orientation, "--group-gap": spacingVar(gap) })}>{children}</div>
      {hasContent(description) && <p id={`${base}-description`} {...getStyles("description")}>{description}</p>}
      {hasContent(error) && <p id={`${base}-error`} role="alert" {...getStyles("error")}>{error}</p>}
    </div>
  );
}
