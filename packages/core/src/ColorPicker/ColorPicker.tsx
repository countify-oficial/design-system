import { useControllableState } from "@countify-oficial/hooks";
import { formatColor, parseColor, useComponentProps, useMessages, type ColorFormat, type HSVA } from "@countify-oficial/provider";
import { useState, type ComponentPropsWithRef, type KeyboardEvent, type PointerEvent } from "react";
import { ColorSwatch } from "../ColorSwatch/ColorSwatch";
import { AlphaSlider, HueSlider } from "../Slider/Slider";
import { useStyles, type StylesApiProps } from "../styles";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";
import classes from "./ColorPicker.module.css";

export interface ColorPickerProps extends StylesApiProps<"root" | "saturation" | "thumb" | "swatches" | "swatch">, Omit<ComponentPropsWithRef<"div">, "className" | "style" | "onChange" | "defaultValue"> {
  /** A cor, no formato de `format`. */
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  /** Chamado ao soltar (ou a cada tecla). */
  onChangeEnd?: ((value: string) => void) | undefined;
  /** hex, hexa, rgb, rgba, hsl ou hsla. Com "a", mostra o trilho de transparência. Padrão: hex. */
  format?: ColorFormat | undefined;
  /** Cores prontas para escolher num toque. */
  swatches?: string[] | undefined;
  /** Só as cores prontas, sem a área e os trilhos. */
  withPicker?: boolean | undefined;
}

const PRETO: HSVA = { h: 0, s: 0, v: 0, a: 1 };

/** Escolhe uma cor: área de saturação e brilho, matiz, transparência e cores prontas. Tudo funciona pelo teclado. */
export function ColorPicker(props: ColorPickerProps) {
  const messages = useMessages();
  const { value, defaultValue, onChange, onChangeEnd, format = "hex", swatches, withPicker = true, className, style, classNames, styles, ...rest } =
    useComponentProps("ColorPicker", {}, props);
  const getStyles = useStyles("ColorPicker", classes, { className, style, classNames, styles });
  const [texto, setTexto] = useControllableState({ value, defaultValue: defaultValue ?? "#000000", onChange });
  // guarda o matiz quando a cor fica cinza (s = 0), para o trilho não pular
  const [ultimo, setUltimo] = useState<HSVA>(() => parseColor(texto) ?? PRETO);
  const lida = parseColor(texto);
  const cor = lida ? { ...lida, h: lida.s === 0 || lida.v === 0 ? ultimo.h : lida.h } : ultimo;
  const comAlfa = format.endsWith("a");
  const mudar = (nova: HSVA, fim = false) => {
    setUltimo(nova);
    const t = formatColor(nova, format);
    setTexto(t);
    if (fim) onChangeEnd?.(t);
  };
  const [arrastando, setArrastando] = useState(false);
  const doPonto = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    if (r.width === 0) return;
    const s = Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100));
    const v = Math.min(100, Math.max(0, 100 - ((e.clientY - r.top) / r.height) * 100));
    mudar({ ...cor, s, v });
  };
  const aoTeclar = (e: KeyboardEvent<HTMLDivElement>) => {
    const d = e.shiftKey ? 10 : 1;
    const nova = { ArrowRight: { s: cor.s + d }, ArrowLeft: { s: cor.s - d }, ArrowUp: { v: cor.v + d }, ArrowDown: { v: cor.v - d } }[e.key];
    if (!nova) return;
    e.preventDefault();
    mudar({ ...cor, s: Math.min(100, Math.max(0, nova.s ?? cor.s)), v: Math.min(100, Math.max(0, nova.v ?? cor.v)) }, true);
  };
  return (
    <div {...rest} {...getStyles("root")}>
      {withPicker && (
        <>
          <div
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              setArrastando(true);
              doPonto(e);
            }}
            onPointerMove={(e) => arrastando && doPonto(e)}
            onPointerUp={() => {
              if (arrastando) onChangeEnd?.(texto);
              setArrastando(false);
            }}
            {...getStyles("saturation", { "--picker-hue": cor.h })}
          >
            <div
              role="slider"
              tabIndex={0}
              aria-label={messages.saturation}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(cor.s)}
              aria-valuetext={`saturação ${Math.round(cor.s)}%, brilho ${Math.round(cor.v)}%`}
              onKeyDown={aoTeclar}
              {...getStyles("thumb", { "--picker-s": `${cor.s}%`, "--picker-v": `${100 - cor.v}%`, "--picker-color": formatColor({ ...cor, a: 1 }, "hex") })}
            />
          </div>
          <HueSlider value={Math.round(cor.h)} onChange={(h) => mudar({ ...cor, h })} onChangeEnd={() => onChangeEnd?.(texto)} />
          {comAlfa && <AlphaSlider color={formatColor({ ...cor, a: 1 }, "hex")} value={cor.a} onChange={(a) => mudar({ ...cor, a })} onChangeEnd={() => onChangeEnd?.(texto)} />}
        </>
      )}
      {swatches && swatches.length > 0 && (
        <div {...getStyles("swatches")}>
          {swatches.map((s) => (
            <UnstyledButton
              key={s}
              aria-label={s}
              aria-pressed={texto.toLowerCase() === s.toLowerCase()}
              onClick={() => {
                const nova = parseColor(s);
                if (nova) mudar(nova, true);
              }}
              {...getStyles("swatch")}
            >
              <ColorSwatch color={s} size="lg" />
            </UnstyledButton>
          ))}
        </div>
      )}
    </div>
  );
}
