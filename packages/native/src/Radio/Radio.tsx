import { useControllableState } from "@countify-oficial/hooks";
import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { borderWidth, fontSize, iconSize, lineHeightPx, state, type Size } from "@countify-oficial/tokens";
import { createContext, useContext, type ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { ChoiceGroup, type ChoiceGroupProps } from "../Checkbox/ChoiceGroup";
import { LinhaDeEscolha } from "../Checkbox/Checkbox";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";

export interface RadioProps {
  label?: ReactNode;
  description?: ReactNode;
  checked?: boolean | undefined;
  onChange?: ((checked: boolean) => void) | undefined;
  size?: Size | undefined;
  labelPosition?: "right" | "left" | undefined;
  value?: string | undefined;
  disabled?: boolean | undefined;
  style?: StyleProp<ViewStyle>;
}

const GrupoDeRadios = createContext<{ valor: string | null; escolher: (v: string) => void } | null>(null);

/** Opção de escolha única (círculo desenhado). Dentro de Radio.Group, escolhe pelo value. */
export function RadioItem(props: RadioProps) {
  const grupo = useContext(GrupoDeRadios);
  const { label, description, checked, onChange, size = "md", labelPosition = "right", value, disabled, style } = useComponentProps("Radio", {}, props);
  const { colors: c } = useCountifyTheme();
  const marcado = grupo && value !== undefined ? grupo.valor === value : !!checked;
  const lado = iconSize[size];
  return (
    <UnstyledButton
      accessibilityRole="radio"
      accessibilityLabel={typeof label === "string" ? label : undefined}
      accessibilityState={{ checked: marcado, disabled: !!disabled }}
      disabled={disabled}
      onPress={() => (grupo && value !== undefined ? grupo.escolher(value) : onChange?.(true))}
      style={({ pressed }) => [{ justifyContent: "center" }, pressed && { opacity: state.pressedOpacity }, style]}
    >
      <LinhaDeEscolha
        labelPosition={labelPosition}
        label={label}
        description={description}
        disabled={disabled}
        controle={
          <View
            style={[
              { width: lado, height: lado, marginTop: (lineHeightPx(fontSize.md) - lado) / 2, borderRadius: lado / 2, borderWidth: borderWidth.thick, alignItems: "center", justifyContent: "center", borderColor: marcado ? c.accent : c.controlBorder, backgroundColor: c.field },
              disabled && { opacity: state.disabledOpacity },
            ]}
          >
            {marcado && <View style={{ width: lado / 2, height: lado / 2, borderRadius: lado / 4, backgroundColor: c.accent }} />}
          </View>
        }
      />
    </UnstyledButton>
  );
}

export type RadioGroupProps = Omit<ChoiceGroupProps, "role"> & {
  value?: string | null | undefined;
  defaultValue?: string | null | undefined;
  onChange?: ((value: string) => void) | undefined;
};

/** Grupo de opções de escolha única. */
export function RadioGroup(props: RadioGroupProps) {
  const { value, defaultValue, onChange, ...rest } = useComponentProps("RadioGroup", {}, props);
  const [valor, setValor] = useControllableState<string | null>({ value, defaultValue: defaultValue ?? null, onChange: (v) => v !== null && onChange?.(v) });
  return (
    <GrupoDeRadios value={{ valor, escolher: setValor }}>
      <ChoiceGroup role="radiogroup" {...rest} />
    </GrupoDeRadios>
  );
}

/** Opção de escolha única. Radio.Group agrupa. */
export const Radio = Object.assign(RadioItem, { Group: RadioGroup });
