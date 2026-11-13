import { useControllableState } from "@countify-oficial/hooks";
import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { borderWidth, fontSize, nativeFontFamily, radius as cantos, space, state, touchTarget, type Size } from "@countify-oficial/tokens";
import { createContext, useContext, type ReactNode } from "react";
import { Text as RNText, type StyleProp, type ViewStyle } from "react-native";
import { ChoiceGroup, type ChoiceGroupProps } from "../Checkbox/ChoiceGroup";
import { ContentColor } from "../contentColor";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";

export interface ChipProps {
  checked?: boolean | undefined;
  defaultChecked?: boolean | undefined;
  onChange?: ((checked: boolean) => void) | undefined;
  value?: string | undefined;
  radius?: Size | undefined;
  disabled?: boolean | undefined;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const GrupoDeChips = createContext<{ valor: string[]; multiplo: boolean; alternar: (v: string) => void } | null>(null);

/** Chip de escolha, com o visual do mockup. */
export function ChipItem(props: ChipProps) {
  const grupo = useContext(GrupoDeChips);
  const { checked, defaultChecked, onChange, value, radius = "sm", disabled, children, style } = useComponentProps("Chip", {}, props);
  const { colors: c } = useCountifyTheme();
  const [proprio, setProprio] = useControllableState({ value: checked, defaultValue: defaultChecked ?? false, onChange });
  const marcado = grupo && value !== undefined ? grupo.valor.includes(value) : proprio;
  const fg = marcado ? c.accent : c.text2;
  return (
    <ContentColor value={fg}>
      <UnstyledButton
        accessibilityRole={grupo && !grupo.multiplo ? "radio" : "checkbox"}
        accessibilityState={{ checked: marcado, disabled: !!disabled }}
        disabled={disabled}
        onPress={() => (grupo && value !== undefined ? grupo.alternar(value) : setProprio(!proprio))}
        style={({ pressed }) => [
          {
            flexDirection: "row", alignItems: "center", gap: space[2], minHeight: touchTarget, paddingHorizontal: space[3], borderRadius: cantos[radius],
            backgroundColor: marcado ? c.accentTint : c.card, borderWidth: marcado ? borderWidth.thick : borderWidth.thin, borderColor: marcado ? c.accent : c.divider,
          },
          pressed && { opacity: state.pressedOpacity },
          disabled && { opacity: state.disabledOpacity },
          style,
        ]}
      >
        {typeof children === "string" ? <RNText style={{ color: fg, fontSize: fontSize.sm, fontFamily: nativeFontFamily[500] }}>{children}</RNText> : children}
      </UnstyledButton>
    </ContentColor>
  );
}

export type ChipGroupProps = Omit<ChoiceGroupProps, "role"> & {
  multiple?: boolean | undefined;
  value?: string[] | undefined;
  defaultValue?: string[] | undefined;
  onChange?: ((value: string[]) => void) | undefined;
};

/** Grupo de chips em linha. */
export function ChipGroup(props: ChipGroupProps) {
  const { multiple = false, value, defaultValue, onChange, orientation = "row", ...rest } = useComponentProps("ChipGroup", {}, props);
  const [valor, setValor] = useControllableState<string[]>({ value, defaultValue: defaultValue ?? [], onChange });
  const alternar = (v: string) => setValor(multiple ? (valor.includes(v) ? valor.filter((x) => x !== v) : [...valor, v]) : [v]);
  return (
    <GrupoDeChips value={{ valor, multiplo: multiple, alternar }}>
      <ChoiceGroup role={multiple ? undefined : "radiogroup"} orientation={orientation} {...rest} />
    </GrupoDeChips>
  );
}

/** Chip de escolha. Chip.Group agrupa. */
export const Chip = Object.assign(ChipItem, { Group: ChipGroup });
