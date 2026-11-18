import { useControllableState } from "@countify-oficial/hooks";
import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { fontSize, listRowHeight, nativeFontFamily, radius, space, state } from "@countify-oficial/tokens";
import type { ReactNode } from "react";
import { Text as RNText, View, type GestureResponderEvent, type StyleProp, type ViewStyle } from "react-native";
import { Collapse } from "../Collapse/Collapse";
import { ContentColor } from "../contentColor";
import { Icon } from "../Icon/Icon";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";

export interface NavLinkProps {
  label: ReactNode;
  description?: ReactNode;
  /** Antes do texto: um ThemeIcon (o quadro de 40 do mockup) ou um Avatar. */
  leftSection?: ReactNode;
  /** Depois do texto: um valor, um Badge ou a seta (Icon chevron-right). */
  rightSection?: ReactNode;
  active?: boolean | undefined;
  disabled?: boolean | undefined;
  opened?: boolean | undefined;
  defaultOpened?: boolean | undefined;
  onChange?: ((opened: boolean) => void) | undefined;
  onPress?: ((e: GestureResponderEvent) => void) | undefined;
  /** Nome para o leitor de tela. Padrão: o label, quando é texto (a descrição vira a dica). */
  accessibilityLabel?: string | undefined;
  /** NavLinks de baixo; a linha abre e fecha. */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Linha de navegação de 64: ícone, título, descrição e o que vai à direita. Com filhos, abre um nível abaixo. */
export function NavLink(props: NavLinkProps) {
  const { label, description, leftSection, rightSection, active, disabled, opened, defaultOpened, onChange, onPress, accessibilityLabel, children, style } = useComponentProps("NavLink", {}, props);
  const { colors: c } = useCountifyTheme();
  const [aberto, setAberto] = useControllableState({ value: opened, defaultValue: defaultOpened ?? false, onChange });
  const temFilhos = children !== undefined && children !== null && children !== false;
  const texto = (v: ReactNode, s: object) => (typeof v === "string" ? <RNText style={s}>{v}</RNText> : v);
  return (
    <View>
      <UnstyledButton
        accessibilityRole={temFilhos ? "button" : "link"}
        accessibilityLabel={accessibilityLabel ?? (typeof label === "string" ? label : undefined)}
        accessibilityHint={accessibilityLabel === undefined && typeof description === "string" ? description : undefined}
        accessibilityState={{ disabled: !!disabled, selected: !!active, ...(temFilhos ? { expanded: aberto } : {}) }}
        disabled={disabled}
        onPress={(e) => {
          onPress?.(e);
          if (temFilhos) setAberto(!aberto);
        }}
        style={({ pressed }) => [
          { flexDirection: "row", alignItems: "center", gap: space[3], minHeight: listRowHeight, paddingVertical: space[3], paddingHorizontal: space[4], borderRadius: radius.sm },
          active && { backgroundColor: c.accentTint },
          pressed && { opacity: state.pressedOpacity },
          disabled && { opacity: state.disabledOpacity },
          style,
        ]}
      >
        {leftSection}
        <View style={{ flex: 1 }}>
          {texto(label, { color: c.text, fontSize: fontSize.md, fontFamily: nativeFontFamily[500] })}
          {description !== undefined && texto(description, { color: c.text2, fontSize: fontSize.sm, fontFamily: nativeFontFamily[400] })}
        </View>
        {(rightSection !== undefined || temFilhos) && (
          <ContentColor value={c.text3}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space[2] }}>
              {texto(rightSection, { color: c.text3, fontSize: fontSize.sm, fontFamily: nativeFontFamily[400], fontVariant: ["tabular-nums"] })}
              {temFilhos && <View style={{ transform: [{ rotate: aberto ? "90deg" : "0deg" }] }}><Icon name="chevron-right" size="xs" /></View>}
            </View>
          </ContentColor>
        )}
      </UnstyledButton>
      {temFilhos && (
        <Collapse in={aberto}>
          <View style={{ paddingLeft: space[6] }}>{children}</View>
        </Collapse>
      )}
    </View>
  );
}
