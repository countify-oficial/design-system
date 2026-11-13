import { useControllableState } from "@countify-oficial/hooks";
import { useComponentProps, useMessages } from "@countify-oficial/provider";
import { SliderBase, type SliderCommonProps } from "./SliderBase";

export interface SliderProps extends SliderCommonProps {
  value?: number | undefined;
  defaultValue?: number | undefined;
  onChange?: ((value: number) => void) | undefined;
  /** Chamado ao soltar a bolinha (ou a cada tecla). */
  onChangeEnd?: ((value: number) => void) | undefined;
  /** Nome para o leitor de tela. */
  label?: string | undefined;
}

/** Escolhe um número arrastando a bolinha (ou com as setas). */
export function Slider(props: SliderProps) {
  const { value, defaultValue, onChange, onChangeEnd, label, min = 0, ...rest } = useComponentProps("Slider", {}, props);
  const [v, setV] = useControllableState({ value, defaultValue: defaultValue ?? min, onChange });
  return <SliderBase nome="Slider" tipo="bar" min={min} {...rest} valores={[v]} nomes={[label]} aoMudar={([n]) => setV(n ?? min)} aoTerminar={([n]) => onChangeEnd?.(n ?? min)} />;
}

export interface RangeSliderProps extends SliderCommonProps {
  value?: [number, number] | undefined;
  defaultValue?: [number, number] | undefined;
  onChange?: ((value: [number, number]) => void) | undefined;
  onChangeEnd?: ((value: [number, number]) => void) | undefined;
  /** Distância mínima entre as duas bolinhas. Padrão: o passo. */
  minRange?: number | undefined;
  /** Nomes das bolinhas para o leitor de tela. Padrão: "Mínimo" e "Máximo". */
  labels?: [string, string] | undefined;
}

/** Escolhe um intervalo com duas bolinhas (as que não se cruzam). */
export function RangeSlider(props: RangeSliderProps) {
  const { value, defaultValue, onChange, onChangeEnd, minRange, labels = ["Mínimo", "Máximo"], min = 0, max = 100, step = 1, ...rest } = useComponentProps("RangeSlider", {}, props);
  const [v, setV] = useControllableState<[number, number]>({ value, defaultValue: defaultValue ?? [min, max], onChange });
  return (
    <SliderBase
      nome="RangeSlider"
      tipo="bar"
      min={min}
      max={max}
      step={step}
      minRange={minRange ?? step}
      {...rest}
      valores={v}
      nomes={labels}
      aoMudar={([a, b]) => setV([a ?? min, b ?? max])}
      aoTerminar={([a, b]) => onChangeEnd?.([a ?? min, b ?? max])}
    />
  );
}

export interface HueSliderProps extends Omit<SliderCommonProps, "min" | "max" | "step" | "color" | "marks"> {
  /** De 0 a 360. */
  value?: number | undefined;
  defaultValue?: number | undefined;
  onChange?: ((value: number) => void) | undefined;
  onChangeEnd?: ((value: number) => void) | undefined;
  label?: string | undefined;
}

/** Escolhe o matiz (0 a 360) num trilho com as cores. */
export function HueSlider(props: HueSliderProps) {
  const messages = useMessages();
  const { value, defaultValue, onChange, onChangeEnd, label = messages.hue, ...rest } = useComponentProps("HueSlider", {}, props);
  const [v, setV] = useControllableState({ value, defaultValue: defaultValue ?? 0, onChange });
  return (
    <SliderBase
      nome="HueSlider"
      tipo="hue"
      min={0}
      max={360}
      step={1}
      corDaBolinha={`hsl(${v} 100% 50%)`}
      getValueText={(n) => `${n}°`}
      {...rest}
      valores={[v]}
      nomes={[label]}
      aoMudar={([n]) => setV(n ?? 0)}
      aoTerminar={([n]) => onChangeEnd?.(n ?? 0)}
    />
  );
}

export interface AlphaSliderProps extends Omit<SliderCommonProps, "min" | "max" | "step" | "color" | "marks"> {
  /** De 0 (transparente) a 1. */
  value?: number | undefined;
  defaultValue?: number | undefined;
  onChange?: ((value: number) => void) | undefined;
  onChangeEnd?: ((value: number) => void) | undefined;
  /** A cor sem transparência (o fim do trilho). */
  color: string;
  label?: string | undefined;
}

/** Escolhe a transparência (0 a 1) de uma cor. */
export function AlphaSlider(props: AlphaSliderProps) {
  const messages = useMessages();
  const { value, defaultValue, onChange, onChangeEnd, color, label = messages.alpha, ...rest } = useComponentProps("AlphaSlider", {}, props);
  const [v, setV] = useControllableState({ value, defaultValue: defaultValue ?? 1, onChange });
  return (
    <SliderBase
      nome="AlphaSlider"
      tipo="alpha"
      min={0}
      max={1}
      step={0.01}
      corDoTrilho={color}
      getValueText={(n) => `${Math.round(n * 100)}%`}
      {...rest}
      valores={[v]}
      nomes={[label]}
      aoMudar={([n]) => setV(n ?? 1)}
      aoTerminar={([n]) => onChangeEnd?.(n ?? 1)}
    />
  );
}
