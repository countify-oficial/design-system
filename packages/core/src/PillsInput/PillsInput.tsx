import { useId } from "@countify-oficial/hooks";
import { hasContent, useComponentProps } from "@countify-oficial/provider";
import type { Size } from "@countify-oficial/tokens";
import { createContext, useContext, type ComponentPropsWithRef, type MouseEvent, type ReactNode } from "react";
import { InputWrapper, type InputWrapperOwnProps } from "../Input/Input";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./PillsInput.module.css";

export interface PillsInputProps
  extends Omit<InputWrapperOwnProps, "id" | "children" | "classNames" | "styles">, StylesApiProps<"root" | "field" | "section">, Omit<ComponentPropsWithRef<"div">, "className" | "style" | "children"> {
  variant?: "filled" | "outline" | undefined;
  size?: Size | undefined;
  radius?: Size | undefined;
  disabled?: boolean | undefined;
  required?: boolean | undefined;
  rightSection?: ReactNode;
  /** As Pill e o PillsInput.Field. */
  children?: ReactNode;
}

const Campo = createContext<{ id: string; descrito: string | undefined; erro: boolean; desligado: boolean } | null>(null);

/** O campo de texto dentro do PillsInput (recebe o rótulo). */
export function PillsInputField(props: ComponentPropsWithRef<"input">) {
  const c = useContext(Campo);
  const { className, ...rest } = props;
  return (
    <input
      id={c?.id}
      aria-describedby={c?.descrito}
      aria-invalid={c?.erro || undefined}
      disabled={c?.desligado}
      {...rest}
      className={[classes["field"], className].filter(Boolean).join(" ")}
    />
  );
}

/** Caixa de campo que junta etiquetas (Pill) e um campo de texto (base do MultiSelect e do TagsInput). */
function PillsInputRoot(props: PillsInputProps) {
  const {
    label, description, error, withAsterisk, required, variant = "filled", size = "md", radius = "sm", disabled, rightSection, children, id, onMouseDown,
    className, style, classNames, styles, ...rest
  } = useComponentProps("PillsInput", {}, props);
  const getStyles = useStyles("PillsInput", classes, { className, style, classNames, styles });
  const base = useId(id);
  const descrito = [hasContent(description) && `${base}-description`, hasContent(error) && `${base}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <InputWrapper id={base} label={label} description={description} error={error} withAsterisk={withAsterisk ?? required}>
      <Campo value={{ id: base, descrito, erro: !!error, desligado: !!disabled }}>
        <div
          role="presentation"
          {...rest}
          data-variant={variant}
          data-error={error ? true : undefined}
          data-disabled={disabled || undefined}
          // clique no espaço vazio da caixa leva ao campo
          onMouseDown={(e: MouseEvent<HTMLDivElement>) => {
            onMouseDown?.(e);
            if (e.target === e.currentTarget) {
              e.preventDefault();
              e.currentTarget.querySelector("input")?.focus();
            }
          }}
          {...getStyles("root", { "--input-height": `var(--cf-input-height-${size})`, "--input-radius": `var(--cf-radius-${radius})` })}
        >
          {children}
          {rightSection !== undefined && <span {...getStyles("section")}>{rightSection}</span>}
        </div>
      </Campo>
    </InputWrapper>
  );
}

/** PillsInput: a caixa; PillsInput.Field é o campo de texto. */
export const PillsInput = Object.assign(PillsInputRoot, { Field: PillsInputField });
