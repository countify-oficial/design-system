import { useComponentProps, useMessages } from "@countify-oficial/provider";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { Icon } from "../Icon/Icon";
import { useStyles, type StylesApiProps } from "../styles";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";
import classes from "./Pill.module.css";

export interface PillProps extends StylesApiProps<"root" | "label" | "remove">, Omit<ComponentPropsWithRef<"span">, "className" | "style"> {
  /** Botão de tirar (×). */
  withRemoveButton?: boolean | undefined;
  onRemove?: (() => void) | undefined;
  /** Nome do botão de tirar. Padrão: "Remover {texto}". */
  removeButtonLabel?: string | undefined;
  disabled?: boolean | undefined;
  children?: ReactNode;
}

/** Etiqueta de um valor escolhido (dentro do MultiSelect e do TagsInput). */
export function PillItem(props: PillProps) {
  const messages = useMessages();
  const { withRemoveButton, onRemove, removeButtonLabel, disabled, children, className, style, classNames, styles, ...rest } = useComponentProps("Pill", {}, props);
  const getStyles = useStyles("Pill", classes, { className, style, classNames, styles });
  const texto = typeof children === "string" ? children : "";
  return (
    <span {...rest} data-with-remove={(withRemoveButton && !disabled) || undefined} {...getStyles("root")}>
      <span {...getStyles("label")}>{children}</span>
      {withRemoveButton && !disabled && (
        <UnstyledButton
          aria-label={removeButtonLabel ?? messages.remove(texto)}
          tabIndex={-1}
          onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onRemove?.();
          }}
          {...getStyles("remove")}
        >
          <Icon name="close" size="xs" />
        </UnstyledButton>
      )}
    </span>
  );
}

/** Grupo de etiquetas, com quebra de linha. */
export function PillGroup({ children, className, ...rest }: ComponentPropsWithRef<"div">) {
  return <div {...rest} className={[classes["group"], className].filter(Boolean).join(" ")}>{children}</div>;
}

/** Pill: a etiqueta; Pill.Group agrupa. */
export const Pill = Object.assign(PillItem, { Group: PillGroup });
