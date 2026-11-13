import { formatColor, parseColor, useComponentProps, type ColorFormat } from "@countify-oficial/provider";
import { useControllableState } from "@countify-oficial/hooks";
import { useState, type ChangeEvent } from "react";
import { ColorPicker } from "../ColorPicker/ColorPicker";
import { ColorSwatch } from "../ColorSwatch/ColorSwatch";
import { InputBase, type InputBaseOwnProps } from "../Input/Input";
import type { PolymorphicProps } from "../polymorphic";
import { Popover } from "../Popover/Popover";

export type ColorInputProps = PolymorphicProps<
  "input",
  Omit<InputBaseOwnProps, "leftSection"> & {
    value?: string | undefined;
    defaultValue?: string | undefined;
    onChange?: ((value: string) => void) | undefined;
    /** Formato do texto. Padrão: hex. */
    format?: ColorFormat | undefined;
    /** Cores prontas no seletor. */
    swatches?: string[] | undefined;
    /** Só as cores prontas, sem a área e os trilhos. */
    withPicker?: boolean | undefined;
  }
>;

/** Campo de cor: escreve a cor ou escolhe no seletor que abre embaixo. Texto que não é cor volta ao último válido. */
export function ColorInput(props: ColorInputProps) {
  const { value, defaultValue, onChange, format = "hex", swatches, withPicker = true, onBlur, ...rest } = useComponentProps("ColorInput", {}, props);
  const [cor, setCor] = useControllableState({ value, defaultValue: defaultValue ?? "", onChange });
  const [texto, setTexto] = useState<string | null>(null);
  const valida = parseColor(cor);
  return (
    <Popover position="bottom-start" width="target" trapFocus={false}>
      <Popover.Target>
        <InputBase
          spellCheck={false}
          {...rest}
          component="input"
          // campo que abre um seletor: combobox (textbox não aceita aria-expanded)
          role="combobox"
          value={texto ?? cor}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setTexto(e.currentTarget.value);
            const nova = parseColor(e.currentTarget.value);
            if (nova) setCor(formatColor(nova, format));
          }}
          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
            setTexto(null);
            onBlur?.(e);
          }}
          leftSection={<ColorSwatch color={valida ? formatColor(valida, "rgba") : "transparent"} size="md" />}
        />
      </Popover.Target>
      <Popover.Dropdown>
        <ColorPicker value={valida ? formatColor(valida, format) : "#000000"} format={format} swatches={swatches} withPicker={withPicker} onChange={setCor} />
      </Popover.Dropdown>
    </Popover>
  );
}
