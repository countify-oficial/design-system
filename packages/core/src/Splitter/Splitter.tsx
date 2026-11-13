import { useControllableState } from "@countify-oficial/hooks";
import { useComponentProps, useMessages } from "@countify-oficial/provider";
import { Children, Fragment, isValidElement, useState, type ComponentPropsWithRef, type KeyboardEvent, type PointerEvent, type ReactElement } from "react";
import { cx, useStyles, type StylesApiProps } from "../styles";
import classes from "./Splitter.module.css";

export type SplitterPanelProps = Omit<ComponentPropsWithRef<"div">, "className"> & { className?: string | undefined };

/** Um painel; o Splitter dá o tamanho. */
export function SplitterPanel(_props: SplitterPanelProps): null {
  return null;
}

export interface SplitterProps extends StylesApiProps<"root" | "panel" | "handle">, Omit<ComponentPropsWithRef<"div">, "className" | "style"> {
  /** horizontal: painéis lado a lado; vertical: um sobre o outro. Padrão: horizontal. */
  orientation?: "horizontal" | "vertical" | undefined;
  /** Tamanho de cada painel, em % (controlado). */
  sizes?: number[] | undefined;
  defaultSizes?: number[] | undefined;
  onSizesChange?: ((sizes: number[]) => void) | undefined;
  /** Tamanho mínimo de cada painel, em %. Padrão: 10. */
  minSize?: number | undefined;
  /** Quanto cada seta muda, em %. Padrão: 5. */
  step?: number | undefined;
}

/** Painéis com alça para mudar o tamanho (arrastar ou setas, Home e End). No computador; no celular, a lista e depois o detalhe. */
function SplitterRoot(props: SplitterProps) {
  const messages = useMessages();
  const { orientation = "horizontal", sizes, defaultSizes, onSizesChange, minSize = 10, step = 5, children, className, style, classNames, styles, ...rest } =
    useComponentProps("Splitter", {}, props);
  const getStyles = useStyles("Splitter", classes, { className, style, classNames, styles });
  const paineis = Children.toArray(children).filter((f): f is ReactElement<SplitterPanelProps> => isValidElement(f) && f.type === SplitterPanel);
  const n = paineis.length;
  const [tamanhos, setTamanhos] = useControllableState<number[]>({ value: sizes, defaultValue: defaultSizes ?? paineis.map(() => 100 / Math.max(1, n)), onChange: onSizesChange });
  const [arrastando, setArrastando] = useState<{ i: number; inicio: number; base: number[]; total: number } | null>(null);
  const horizontal = orientation === "horizontal";
  const painel = getStyles("panel");
  // muda o painel i e o seguinte, sem passar do mínimo
  const mover = (i: number, base: number[], delta: number) => {
    const a = base[i] ?? 0;
    const b = base[i + 1] ?? 0;
    const d = Math.max(minSize - a, Math.min(b - minSize, delta));
    setTamanhos(base.map((t, k) => (k === i ? a + d : k === i + 1 ? b - d : t)));
  };
  const teclar = (e: KeyboardEvent<HTMLDivElement>, i: number) => {
    const [menos, mais] = horizontal ? ["ArrowLeft", "ArrowRight"] : ["ArrowUp", "ArrowDown"];
    const a = tamanhos[i] ?? 0;
    const b = tamanhos[i + 1] ?? 0;
    const delta = { [menos]: -step, [mais]: step, Home: minSize - a, End: b - minSize }[e.key];
    if (delta === undefined) return;
    e.preventDefault();
    mover(i, tamanhos, delta);
  };
  return (
    <div data-orientation={orientation} {...rest} {...getStyles("root")}>
      {paineis.map((p, i) => {
        const { className: cls, style: est, ...prp } = p.props;
        return (
          <Fragment key={p.key ?? i}>
            {i > 0 && (
              // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- separator focável é um widget (padrão "window splitter" do WAI-ARIA)
              <div
                role="separator"
                // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- idem: a alça entra no Tab para mudar o tamanho pelas setas
                tabIndex={0}
                aria-label={messages.resizePanels}
                aria-orientation={horizontal ? "vertical" : "horizontal"}
                aria-valuenow={Math.round(tamanhos[i - 1] ?? 0)}
                aria-valuemin={minSize}
                aria-valuemax={100 - minSize}
                data-dragging={arrastando?.i === i - 1 || undefined}
                onKeyDown={(e) => teclar(e, i - 1)}
                onPointerDown={(e: PointerEvent<HTMLDivElement>) => {
                  const raiz = e.currentTarget.parentElement;
                  if (!raiz) return;
                  e.currentTarget.setPointerCapture(e.pointerId);
                  setArrastando({ i: i - 1, inicio: horizontal ? e.clientX : e.clientY, base: tamanhos, total: horizontal ? raiz.clientWidth : raiz.clientHeight });
                }}
                onPointerMove={(e: PointerEvent<HTMLDivElement>) => {
                  if (!arrastando || arrastando.total <= 0) return;
                  const px = (horizontal ? e.clientX : e.clientY) - arrastando.inicio;
                  mover(arrastando.i, arrastando.base, (px / arrastando.total) * 100);
                }}
                onPointerUp={() => setArrastando(null)}
                onPointerCancel={() => setArrastando(null)}
                {...getStyles("handle")}
              />
            )}
            <div {...prp} className={cx(painel.className, cls)} style={{ ...painel.style, flexGrow: tamanhos[i] ?? 0, ...est }} />
          </Fragment>
        );
      })}
    </div>
  );
}

/** Splitter com um Splitter.Panel por painel. */
export const Splitter = Object.assign(SplitterRoot, { Panel: SplitterPanel });
