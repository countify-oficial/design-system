import { useId } from "@countify-oficial/hooks";
import { hasContent, useComponentProps, useMessages } from "@countify-oficial/provider";
import type { Size } from "@countify-oficial/tokens";
import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import type { PolymorphicProps } from "../polymorphic";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./Input.module.css";

// ---------- InputWrapper: rótulo, descrição e erro em volta do campo

export interface InputWrapperOwnProps extends StylesApiProps<"root" | "label" | "required" | "description" | "error"> {
  /** id do campo: liga o rótulo, a descrição e o erro. */
  id: string;
  /** Rótulo, sempre visível (identidade). */
  label?: ReactNode;
  /** Texto de ajuda, embaixo do campo. */
  description?: ReactNode;
  /** Mensagem de erro, embaixo do campo, anunciada na hora. true só marca o campo. */
  error?: ReactNode;
  /** Mostra o asterisco no rótulo. */
  withAsterisk?: boolean | undefined;
  children?: ReactNode;
}

export type InputWrapperProps = InputWrapperOwnProps & Omit<ComponentPropsWithRef<"div">, keyof InputWrapperOwnProps | "className" | "style">;

/** Rótulo, descrição e erro de um campo. */
export function InputWrapper(props: InputWrapperProps) {
  const messages = useMessages();
  const { id, label, description, error, withAsterisk, children, className, style, classNames, styles, ...rest } = useComponentProps("InputWrapper", {}, props);
  const getStyles = useStyles("InputWrapper", { root: classes["wrapper"] ?? "", label: classes["label"] ?? "", required: classes["required"] ?? "", description: classes["description"] ?? "", error: classes["error"] ?? "" }, { className, style, classNames, styles });
  return (
    <div {...rest} {...getStyles("root")}>
      {hasContent(label) && (
        <label htmlFor={id} id={`${id}-label`} {...getStyles("label")}>
          {label}
          {withAsterisk && <span {...getStyles("required")}><span aria-hidden>*</span><span style={{ display: "none" }}>{messages.required}</span></span>}
        </label>
      )}
      {children}
      {hasContent(description) && <p id={`${id}-description`} {...getStyles("description")}>{description}</p>}
      {hasContent(error) && <p id={`${id}-error`} role="alert" {...getStyles("error")}>{error}</p>}
    </div>
  );
}

// ---------- Input: a caixa do campo, com seções à esquerda e à direita

export interface InputOwnProps extends StylesApiProps<"root" | "input" | "section"> {
  /** filled: fundo de campo, sem contorno (mockup); outline: com o anel da borda, para campo sobre cartão. Padrão: filled. */
  variant?: "filled" | "outline" | undefined;
  /** Altura e letra: xs/sm 44, md 48, lg 52, xl 56. Padrão: md. */
  size?: Size | undefined;
  /** Canto. Padrão: sm (12). */
  radius?: Size | undefined;
  /** Antes do texto (um ícone de busca). */
  leftSection?: ReactNode;
  /** Depois do texto (um botão de limpar, uma unidade). */
  rightSection?: ReactNode;
  /** Seções só decorativas deixam o clique passar para o campo. */
  leftSectionPointerEvents?: "none" | "auto" | undefined;
  rightSectionPointerEvents?: "none" | "auto" | undefined;
  /** Campo com erro: anel vermelho e aria-invalid. */
  error?: boolean | undefined;
  disabled?: boolean | undefined;
  /** Props da caixa (a div em volta do campo). */
  wrapperProps?: ComponentPropsWithRef<"div"> | undefined;
}

export type InputProps<C extends ElementType = "input"> = PolymorphicProps<C, InputOwnProps>;

/** A caixa do campo, sem rótulo. Para um campo completo, use TextInput (ou InputBase). */
export function Input<C extends ElementType = "input">(props: InputProps<C>) {
  const {
    component, variant = "filled", size = "md", radius = "sm", leftSection, rightSection, leftSectionPointerEvents, rightSectionPointerEvents,
    error, disabled, wrapperProps, className, style, classNames, styles, ...rest
  } = useComponentProps("Input", {}, props);
  const getStyles = useStyles("Input", classes, { className, style, classNames, styles });
  const Component: ElementType = component ?? "input";
  return (
    <div
      {...wrapperProps}
      data-variant={variant}
      data-error={error || undefined}
      data-disabled={disabled || undefined}
      {...getStyles("root", {
        "--input-height": `var(--cf-input-height-${size})`,
        "--input-fz": `var(--cf-control-font-size-${size})`,
        "--input-radius": `var(--cf-radius-${radius})`,
      })}
    >
      {leftSection !== undefined && <span data-position="left" data-pointer-events={leftSectionPointerEvents} {...getStyles("section")}>{leftSection}</span>}
      <Component aria-invalid={error || undefined} disabled={disabled} {...rest} {...getStyles("input")} />
      {rightSection !== undefined && <span data-position="right" data-pointer-events={rightSectionPointerEvents} {...getStyles("section")}>{rightSection}</span>}
    </div>
  );
}

// ---------- InputBase: rótulo + caixa; a base dos outros campos

export type InputBaseOwnProps = Omit<InputOwnProps, "error" | "classNames" | "styles"> &
  Omit<InputWrapperOwnProps, "id" | "children" | "classNames" | "styles"> & {
    id?: string | undefined;
    required?: boolean | undefined;
    /** Partes: root, label, required, description, error (rótulo e mensagens), wrapper (a caixa), input e section. */
    classNames?: Partial<Record<InputBasePart, string>> | undefined;
    styles?: Partial<Record<InputBasePart, React.CSSProperties>> | undefined;
    /** Props da div de fora (a do rótulo). */
    rootProps?: ComponentPropsWithRef<"div"> | undefined;
  };

export type InputBasePart = "root" | "label" | "required" | "description" | "error" | "wrapper" | "input" | "section";

export type InputBaseProps<C extends ElementType = "input"> = PolymorphicProps<C, InputBaseOwnProps>;

/** Campo completo: rótulo, caixa, descrição e erro, ligados por id e aria. */
export function InputBase<C extends ElementType = "input">(props: InputBaseProps<C>) {
  const {
    id, label, description, error, required, withAsterisk, rootProps, className, style, classNames, styles, ...rest
  } = useComponentProps("InputBase", {}, props);
  const campo = useId(id);
  // o aria-describedby de quem usa soma à descrição e ao erro, em vez de ser trocado por eles
  const doUsuario = (rest as { "aria-describedby"?: string | undefined })["aria-describedby"];
  const descrito = [doUsuario, hasContent(description) && `${campo}-description`, hasContent(error) && `${campo}-error`].filter(Boolean).join(" ") || undefined;
  const input = {
    ...rest,
    id: campo,
    required,
    error: !!error,
    "aria-describedby": descrito,
    classNames: { root: classNames?.wrapper, input: classNames?.input, section: classNames?.section },
    styles: { root: styles?.wrapper, input: styles?.input, section: styles?.section },
  } as InputProps<C>;
  return (
    <InputWrapper
      {...rootProps}
      id={campo}
      label={label}
      description={description}
      error={error}
      withAsterisk={withAsterisk ?? required}
      className={className}
      style={style}
      classNames={classNames}
      styles={styles}
    >
      <Input {...input} />
    </InputWrapper>
  );
}
