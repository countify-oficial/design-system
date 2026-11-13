import { useControllableState, useId } from "@countify-oficial/hooks";
import { useComponentProps, useMessages } from "@countify-oficial/provider";
import { useEffect, useState, type ComponentPropsWithRef, type ReactNode } from "react";
import { useStyles, type StylesApiProps } from "../styles";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";
import classes from "./Spoiler.module.css";

export interface SpoilerProps extends StylesApiProps<"root" | "content" | "control">, Omit<ComponentPropsWithRef<"div">, "className" | "style"> {
  /** Altura mostrada fechado, em px. */
  maxHeight: number;
  /** Texto para abrir. Padrão: "Mostrar mais" do provider. */
  showLabel?: ReactNode;
  /** Texto para fechar. Padrão: "Mostrar menos" do provider. */
  hideLabel?: ReactNode;
  expanded?: boolean | undefined;
  defaultExpanded?: boolean | undefined;
  onExpandedChange?: ((expanded: boolean) => void) | undefined;
}

/** Corta um texto longo numa altura e oferece "Mostrar mais". O botão só aparece se o conteúdo passar da altura. */
export function Spoiler(props: SpoilerProps) {
  const messages = useMessages();
  const {
    maxHeight, showLabel = messages.showMore, hideLabel = messages.showLess, expanded, defaultExpanded, onExpandedChange,
    children, id, className, style, classNames, styles, ...rest
  } = useComponentProps("Spoiler", {}, props);
  const getStyles = useStyles("Spoiler", classes, { className, style, classNames, styles });
  const idConteudo = useId(id);
  const [aberto, setAberto] = useControllableState({ value: expanded, defaultValue: defaultExpanded ?? false, onChange: onExpandedChange });
  const [conteudo, setConteudo] = useState<HTMLDivElement | null>(null);
  const [passa, setPassa] = useState(false);
  useEffect(() => {
    if (!conteudo) return;
    const medir = new ResizeObserver(() => setPassa(conteudo.scrollHeight > maxHeight));
    medir.observe(conteudo);
    return () => medir.disconnect();
  }, [conteudo, maxHeight]);
  return (
    <div {...rest} data-expanded={aberto || undefined} {...getStyles("root", { "--spoiler-max-height": `${maxHeight}px` })}>
      <div id={idConteudo} ref={setConteudo} {...getStyles("content")}>{children}</div>
      {passa && (
        <UnstyledButton aria-expanded={aberto} aria-controls={idConteudo} onClick={() => setAberto(!aberto)} {...getStyles("control")}>
          {aberto ? hideLabel : showLabel}
        </UnstyledButton>
      )}
    </div>
  );
}
