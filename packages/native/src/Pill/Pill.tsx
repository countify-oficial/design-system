import { useComponentProps, useCountifyTheme, useMessages } from "@countify-oficial/provider";
import { fontSize, nativeFontFamily, radius, space, touchTarget } from "@countify-oficial/tokens";
import type { ReactNode } from "react";
import { Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";
import { ContentColor } from "../contentColor";
import { Icon } from "../Icon/Icon";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";

export interface PillProps {
  withRemoveButton?: boolean | undefined;
  onRemove?: (() => void) | undefined;
  removeButtonLabel?: string | undefined;
  disabled?: boolean | undefined;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Etiqueta de um valor escolhido. O botão de tirar tem 24 com área de toque de 44. */
export function PillItem(props: PillProps) {
  const messages = useMessages();
  const { withRemoveButton, onRemove, removeButtonLabel, disabled, children, style } = useComponentProps("Pill", {}, props);
  const { colors: c } = useCountifyTheme();
  const folga = (touchTarget - space[6]) / 2;
  return (
    <View style={[{ flexDirection: "row", alignItems: "center", gap: space[1], minHeight: space[6] + space[1], paddingLeft: space[2], paddingRight: withRemoveButton && !disabled ? 0 : space[2], borderRadius: radius.xs, backgroundColor: c.chip }, style]}>
      {typeof children === "string" ? <RNText numberOfLines={1} style={{ color: c.text, fontSize: fontSize.sm, fontFamily: nativeFontFamily[400] }}>{children}</RNText> : children}
      {withRemoveButton && !disabled && (
        <ContentColor value={c.text2}>
          <UnstyledButton
            accessibilityLabel={removeButtonLabel ?? messages.remove(typeof children === "string" ? children : "")}
            hitSlop={folga}
            onPress={onRemove}
            style={{ width: space[6], height: space[6], minWidth: space[6], minHeight: space[6], alignItems: "center", justifyContent: "center" }}
          >
            <Icon name="close" size="xs" />
          </UnstyledButton>
        </ContentColor>
      )}
    </View>
  );
}

/** Grupo de etiquetas. */
export function PillGroup({ children, style }: { children?: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ flexDirection: "row", flexWrap: "wrap", gap: space[1] }, style]}>{children}</View>;
}

/** Pill e Pill.Group. */
export const Pill = Object.assign(PillItem, { Group: PillGroup });
