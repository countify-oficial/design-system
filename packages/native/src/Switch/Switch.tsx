import { useControllableState } from "@countify-oficial/hooks";
import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { space, state } from "@countify-oficial/tokens";
import { createContext, useContext, type ReactNode } from "react";
import { Switch as RNSwitch, type StyleProp, type ViewStyle } from "react-native";
import { ChoiceGroup, type ChoiceGroupProps } from "../Checkbox/ChoiceGroup";
import { LinhaDeEscolha } from "../Checkbox/Checkbox";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";

export interface SwitchProps {
  label?: ReactNode;
  description?: ReactNode;
  checked?: boolean | undefined;
  defaultChecked?: boolean | undefined;
  onChange?: ((checked: boolean) => void) | undefined;
  /** Rótulo à esquerda e o interruptor no fim (o do mockup), ou à direita. Padrão: left. */
  labelPosition?: "left" | "right" | undefined;
  value?: string | undefined;
  disabled?: boolean | undefined;
  style?: StyleProp<ViewStyle>;
}

const GrupoDeInterruptores = createContext<{ valor: string[]; alternar: (v: string) => void } | null>(null);

/** Interruptor do sistema nas cores da identidade (trilho de borda ou de destaque, bolinha da folha). A linha toda é tocável. */
export function SwitchItem(props: SwitchProps) {
  const grupo = useContext(GrupoDeInterruptores);
  const { label, description, checked, defaultChecked, onChange, labelPosition = "left", value, disabled, style } = useComponentProps("Switch", {}, props);
  const { colors: c } = useCountifyTheme();
  const [proprio, setProprio] = useControllableState({ value: checked, defaultValue: defaultChecked ?? false, onChange });
  const ligado = grupo && value !== undefined ? grupo.valor.includes(value) : proprio;
  const alternar = () => (grupo && value !== undefined ? grupo.alternar(value) : setProprio(!proprio));
  return (
    <UnstyledButton
      accessibilityRole="switch"
      accessibilityLabel={typeof label === "string" ? label : undefined}
      accessibilityState={{ checked: ligado, disabled: !!disabled }}
      disabled={disabled}
      onPress={alternar}
      style={({ pressed }) => [{ justifyContent: "center" }, pressed && { opacity: state.pressedOpacity }, style]}
    >
      <LinhaDeEscolha
        labelPosition={labelPosition}
        label={label}
        description={description}
        disabled={disabled}
        controle={
          <RNSwitch
            value={ligado}
            onValueChange={alternar}
            disabled={disabled}
            importantForAccessibility="no-hide-descendants"
            accessibilityElementsHidden
            trackColor={{ false: c.border, true: c.accent }}
            ios_backgroundColor={c.border}
            thumbColor={c.sheet}
            style={[{ marginVertical: -space[1] }, disabled && { opacity: state.disabledOpacity }]}
          />
        }
      />
    </UnstyledButton>
  );
}

export type SwitchGroupProps = Omit<ChoiceGroupProps, "role"> & {
  value?: string[] | undefined;
  defaultValue?: string[] | undefined;
  onChange?: ((value: string[]) => void) | undefined;
};

/** Grupo de interruptores. */
export function SwitchGroup(props: SwitchGroupProps) {
  const { value, defaultValue, onChange, ...rest } = useComponentProps("SwitchGroup", {}, props);
  const [valor, setValor] = useControllableState<string[]>({ value, defaultValue: defaultValue ?? [], onChange });
  return (
    <GrupoDeInterruptores value={{ valor, alternar: (v) => setValor(valor.includes(v) ? valor.filter((x) => x !== v) : [...valor, v]) }}>
      <ChoiceGroup {...rest} />
    </GrupoDeInterruptores>
  );
}

/** Interruptor. Switch.Group agrupa. */
export const Switch = Object.assign(SwitchItem, { Group: SwitchGroup });
