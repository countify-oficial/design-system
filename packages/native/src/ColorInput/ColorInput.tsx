import { useControllableState } from "@countify-oficial/hooks";
import { formatColor, parseColor, useComponentProps, type ColorFormat } from "@countify-oficial/provider";
import { useState } from "react";
import { ActionIcon } from "../ActionIcon/ActionIcon";
import { ColorPicker } from "../ColorPicker/ColorPicker";
import { ColorSwatch } from "../ColorSwatch/ColorSwatch";
import { Drawer } from "../Drawer/Drawer";
import { Icon } from "../Icon/Icon";
import { InputBase, type InputBaseProps } from "../Input/Input";

export type ColorInputProps = Omit<InputBaseProps, "rows" | "value" | "defaultValue" | "onChange" | "onChangeText" | "leftSection" | "rightSection"> & {
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  format?: ColorFormat | undefined;
  swatches?: string[] | undefined;
  withPicker?: boolean | undefined;
  /** Nome do botão que abre o seletor. Padrão: "Escolher cor". */
  pickerLabel?: string | undefined;
};

/** Campo de cor: escreve a cor ou escolhe no seletor, que abre numa folha. */
export function ColorInput(props: ColorInputProps) {
  const { value, defaultValue, onChange, format = "hex", swatches, withPicker = true, pickerLabel = "Escolher cor", label, ...rest } = useComponentProps("ColorInput", {}, props);
  const [cor, setCor] = useControllableState({ value, defaultValue: defaultValue ?? "", onChange });
  const [texto, setTexto] = useState<string | null>(null);
  const [aberto, setAberto] = useState(false);
  const valida = parseColor(cor);
  return (
    <>
      <InputBase
        autoCapitalize="none"
        autoCorrect={false}
        label={label}
        {...rest}
        value={texto ?? cor}
        onChangeText={(t) => {
          setTexto(t);
          const nova = parseColor(t);
          if (nova) setCor(formatColor(nova, format));
        }}
        onBlur={() => setTexto(null)}
        leftSection={<ColorSwatch color={valida ? formatColor(valida, "rgba") : "transparent"} size="md" />}
        rightSection={<ActionIcon accessibilityLabel={pickerLabel} color="text2" onPress={() => setAberto(true)}><Icon name="sliders" /></ActionIcon>}
      />
      <Drawer opened={aberto} onClose={() => setAberto(false)} title={label} position="bottom">
        <ColorPicker value={valida ? formatColor(valida, format) : "#000000"} format={format} swatches={swatches} withPicker={withPicker} onChange={setCor} />
      </Drawer>
    </>
  );
}
