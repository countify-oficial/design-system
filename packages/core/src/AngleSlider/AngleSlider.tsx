import { useControllableState } from "@countify-oficial/hooks";
import { useComponentProps } from "@countify-oficial/provider";
import type { Size, Tone } from "@countify-oficial/tokens";
import { useState, type ComponentPropsWithRef, type KeyboardEvent, type PointerEvent } from "react";
import { toneVars, useStyles, type StylesApiProps } from "../styles";
import classes from "./AngleSlider.module.css";

export interface AngleSliderProps extends StylesApiProps<"root" | "thumb" | "label">, Omit<ComponentPropsWithRef<"div">, "className" | "style" | "onChange" | "defaultValue" | "color"> {
  /** Ângulo de 0 a 359 (0 em cima, sentido horário). */
  value?: number | undefined;
  defaultValue?: number | undefined;
  onChange?: ((value: number) => void) | undefined;
  onChangeEnd?: ((value: number) => void) | undefined;
  /** Padrão: 1. */
  step?: number | undefined;
  /** Lado, o dos avatares: xs 24 … xl 64. Padrão: xl. */
  size?: Size | undefined;
  /** Mostra o ângulo no centro. Padrão: true. */
  withLabel?: boolean | undefined;
  color?: Tone | undefined;
  disabled?: boolean | undefined;
  /** Nome para o leitor de tela. */
  label?: string | undefined;
}

/** Escolhe um ângulo girando o ponteiro (direção de uma câmera, por exemplo). */
export function AngleSlider(props: AngleSliderProps) {
  const { value, defaultValue, onChange, onChangeEnd, step = 1, size = "xl", withLabel = true, color = "accent", disabled, label, className, style, classNames, styles, ...rest } =
    useComponentProps("AngleSlider", {}, props);
  const getStyles = useStyles("AngleSlider", classes, { className, style, classNames, styles });
  const [angulo, setAngulo] = useControllableState({ value, defaultValue: defaultValue ?? 0, onChange });
  const [arrastando, setArrastando] = useState(false);
  const normal = (a: number) => ((Math.round(a / step) * step) % 360 + 360) % 360;
  const doPonto = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const graus = (Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) * 180) / Math.PI;
    setAngulo(normal(graus));
  };
  const aoTeclar = (e: KeyboardEvent<HTMLDivElement>) => {
    const destino = { ArrowRight: angulo + step, ArrowUp: angulo + step, ArrowLeft: angulo - step, ArrowDown: angulo - step, PageUp: angulo + 15, PageDown: angulo - 15, Home: 0, End: 359 }[e.key];
    if (destino === undefined || disabled) return;
    e.preventDefault();
    const n = normal(destino);
    setAngulo(n);
    onChangeEnd?.(n);
  };
  return (
    <div
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={359}
      aria-valuenow={angulo}
      aria-valuetext={`${angulo} graus`}
      aria-disabled={disabled || undefined}
      {...rest}
      data-disabled={disabled || undefined}
      onKeyDown={aoTeclar}
      onPointerDown={(e) => {
        if (disabled) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        setArrastando(true);
        doPonto(e);
      }}
      onPointerMove={(e) => arrastando && doPonto(e)}
      onPointerUp={() => {
        if (arrastando) onChangeEnd?.(angulo);
        setArrastando(false);
      }}
      {...getStyles("root", { ...toneVars(color), "--angle-size": `var(--cf-avatar-size-${size})`, "--angle": `${angulo}deg` })}
    >
      <span aria-hidden {...getStyles("thumb")} />
      {withLabel && <span aria-hidden {...getStyles("label")}>{angulo}°</span>}
    </div>
  );
}
