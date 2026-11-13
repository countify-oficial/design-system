import { useControllableState } from "@countify-oficial/hooks";
import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { borderWidth, fontSize, iconSize, lineHeightPx, nativeFontFamily, space, state, type Size } from "@countify-oficial/tokens";
import { createContext, useContext, type ReactNode } from "react";
import { Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";
import { ContentColor } from "../contentColor";
import { Icon } from "../Icon/Icon";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";
import { ChoiceGroup, type ChoiceGroupProps } from "./ChoiceGroup";

export interface CheckboxProps {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  checked?: boolean | undefined;
  defaultChecked?: boolean | undefined;
  onChange?: ((checked: boolean) => void) | undefined;
  /** Meio marcado ("Selecionar todos" com só alguns). */
  indeterminate?: boolean | undefined;
  /** Lado da caixa. Padrão: md (22). */
  size?: Size | undefined;
  labelPosition?: "right" | "left" | undefined;
  value?: string | undefined;
  disabled?: boolean | undefined;
  style?: StyleProp<ViewStyle>;
}

const GrupoDeCaixas = createContext<{ valor: string[]; alternar: (v: string) => void } | null>(null);

/** Linha com rótulo e descrição (as caixas, os radios e os interruptores do celular). */
export function LinhaDeEscolha({ controle, label, description, error, labelPosition, disabled }: { controle: ReactNode; label?: ReactNode; description?: ReactNode; error?: ReactNode; labelPosition: "left" | "right"; disabled?: boolean | undefined }) {
  const { colors: c } = useCountifyTheme();
  const tem = (v: ReactNode) => v !== undefined && v !== null && v !== false && v !== "";
  const texto = (v: ReactNode, s: object) => (typeof v === "string" ? <RNText style={s}>{v}</RNText> : v);
  return (
    <View style={{ flexDirection: labelPosition === "left" ? "row-reverse" : "row", alignItems: "flex-start", gap: space[3], justifyContent: labelPosition === "left" ? "space-between" : "flex-start" }}>
      {controle}
      {(tem(label) || tem(description) || tem(error)) && (
        <View style={{ flex: 1 }}>
          {tem(label) && texto(label, { color: disabled ? c.text2 : c.text, fontSize: fontSize.md, lineHeight: lineHeightPx(fontSize.md), fontFamily: nativeFontFamily[400] })}
          {tem(description) && texto(description, { color: c.text2, fontSize: fontSize.sm, fontFamily: nativeFontFamily[400] })}
          {tem(error) && texto(error, { color: c.down, fontSize: fontSize.sm, fontFamily: nativeFontFamily[400] })}
        </View>
      )}
    </View>
  );
}

/** Caixa de marcar com rótulo (desenhada: o React Native não tem caixa). Dentro de Checkbox.Group, marca pelo value. */
export function CheckboxItem(props: CheckboxProps) {
  const grupo = useContext(GrupoDeCaixas);
  const { label, description, error, checked, defaultChecked, onChange, indeterminate, size = "md", labelPosition = "right", value, disabled, style } = useComponentProps("Checkbox", {}, props);
  const { colors: c } = useCountifyTheme();
  const [proprio, setProprio] = useControllableState({ value: checked, defaultValue: defaultChecked ?? false, onChange });
  const marcado = grupo && value !== undefined ? grupo.valor.includes(value) : proprio;
  const lado = iconSize[size];
  const cheio = marcado || indeterminate;
  return (
    <UnstyledButton
      accessibilityRole="checkbox"
      accessibilityLabel={typeof label === "string" ? label : undefined}
      accessibilityHint={typeof description === "string" ? description : undefined}
      accessibilityState={{ checked: indeterminate ? "mixed" : marcado, disabled: !!disabled }}
      disabled={disabled}
      onPress={() => (grupo && value !== undefined ? grupo.alternar(value) : setProprio(!proprio))}
      style={({ pressed }) => [{ justifyContent: "center" }, pressed && { opacity: state.pressedOpacity }, style]}
    >
      <LinhaDeEscolha
        labelPosition={labelPosition}
        label={label}
        description={description}
        error={error}
        disabled={disabled}
        controle={
          <ContentColor value={c.bg}>
            <View
              style={[
                { width: lado, height: lado, marginTop: (lineHeightPx(fontSize.md) - lado) / 2, borderRadius: space[1], borderWidth: borderWidth.thick, alignItems: "center", justifyContent: "center", borderColor: cheio ? c.accent : c.borderStrong, backgroundColor: cheio ? c.accent : c.field },
                disabled && { opacity: state.disabledOpacity },
              ]}
            >
              {cheio && <Icon name={indeterminate ? "minus" : "check"} size="xs" />}
            </View>
          </ContentColor>
        }
      />
    </UnstyledButton>
  );
}

export type CheckboxGroupProps = Omit<ChoiceGroupProps, "role"> & {
  value?: string[] | undefined;
  defaultValue?: string[] | undefined;
  onChange?: ((value: string[]) => void) | undefined;
};

/** Grupo de caixas: guarda a lista dos marcados. */
export function CheckboxGroup(props: CheckboxGroupProps) {
  const { value, defaultValue, onChange, ...rest } = useComponentProps("CheckboxGroup", {}, props);
  const [valor, setValor] = useControllableState<string[]>({ value, defaultValue: defaultValue ?? [], onChange });
  return (
    <GrupoDeCaixas value={{ valor, alternar: (v) => setValor(valor.includes(v) ? valor.filter((x) => x !== v) : [...valor, v]) }}>
      <ChoiceGroup {...rest} />
    </GrupoDeCaixas>
  );
}

/** Estado do "Selecionar todos": all, none ou some. */
export const selectAllState = (todos: string[], marcados: string[]): "all" | "none" | "some" =>
  marcados.length === 0 ? "none" : todos.every((t) => marcados.includes(t)) ? "all" : "some";

/** Caixa de marcar. Checkbox.Group agrupa. */
export const Checkbox = Object.assign(CheckboxItem, { Group: CheckboxGroup });
