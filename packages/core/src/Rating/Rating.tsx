import { useControllableState, useId } from "@countify-oficial/hooks";
import { useComponentProps } from "@countify-oficial/provider";
import type { Size, Tone } from "@countify-oficial/tokens";
import type { ComponentPropsWithRef } from "react";
import { Icon } from "../Icon/Icon";
import { colorVar, useStyles, type StylesApiProps } from "../styles";
import { tones } from "@countify-oficial/tokens";
import classes from "./Rating.module.css";

export interface RatingProps extends StylesApiProps<"root" | "symbol" | "input">, Omit<ComponentPropsWithRef<"div">, "className" | "style" | "onChange" | "defaultValue"> {
  value?: number | undefined;
  defaultValue?: number | undefined;
  onChange?: ((value: number) => void) | undefined;
  /** Quantas estrelas. Padrão: 5. */
  count?: number | undefined;
  /** Só mostra (sem escolher); o leitor de tela lê "4 de 5". */
  readOnly?: boolean | undefined;
  /** Tamanho da estrela, o dos ícones. Padrão: md (22). */
  size?: Size | undefined;
  /** Tom das estrelas cheias. Padrão: warn (âmbar). */
  color?: Tone | undefined;
  /** Nome do grupo para o leitor de tela. */
  label?: string | undefined;
  name?: string | undefined;
}

/** Nota em estrelas. Cada estrela é um radio: setas e Tab funcionam como num grupo de opções. */
export function Rating(props: RatingProps) {
  const { value, defaultValue, onChange, count = 5, readOnly, size = "md", color = "warn", label, name, className, style, classNames, styles, ...rest } =
    useComponentProps("Rating", {}, props);
  const getStyles = useStyles("Rating", classes, { className, style, classNames, styles });
  const nome = useId(name);
  const [nota, setNota] = useControllableState({ value, defaultValue: defaultValue ?? 0, onChange });
  const estrelas = Array.from({ length: count }, (_, i) => i + 1);
  const cor = { "--rating-color": colorVar(tones[color].fill) };
  if (readOnly) {
    return (
      <div role="img" aria-label={`${label ? `${label}: ` : ""}${nota} de ${count}`} {...rest} data-read-only {...getStyles("root", cor)}>
        {estrelas.map((n) => <span key={n} data-full={n <= nota || undefined} {...getStyles("symbol")}><Icon name="star" size={size} /></span>)}
      </div>
    );
  }
  return (
    <div role="radiogroup" aria-label={label} {...rest} {...getStyles("root", cor)}>
      {estrelas.map((n) => (
        <span key={n} data-full={n <= nota || undefined} {...getStyles("symbol")}>
          <input type="radio" name={nome} value={n} checked={nota === n} aria-label={`${n} de ${count}`} onChange={() => setNota(n)} {...getStyles("input")} />
          <Icon name="star" size={size} />
        </span>
      ))}
    </div>
  );
}
