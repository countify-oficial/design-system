import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { borderWidth, dialogWidth, gutter, nativeRaisedShadow, radius, space, zIndex } from "@countify-oficial/tokens";
import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { CloseButton } from "../CloseButton/CloseButton";
import { Transition } from "../Transition/Transition";

export interface DialogProps {
  opened: boolean;
  onClose?: (() => void) | undefined;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | undefined;
  withCloseButton?: boolean | undefined;
  closeButtonLabel?: string | undefined;
  size?: number | undefined;
  accessibilityLabel?: string | undefined;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Caixa fixa num canto, sem véu (ponha no topo da tela: o React Native não tem portal). */
export function Dialog(props: DialogProps) {
  const { opened, onClose, position = "bottom-right", withCloseButton, closeButtonLabel, size = dialogWidth, accessibilityLabel, children, style } = useComponentProps("Dialog", {}, props);
  const { colors: c, colorScheme } = useCountifyTheme();
  const [v, h] = position.split("-") as ["top" | "bottom", "left" | "right"];
  return (
    <Transition mounted={opened} transition="slide-up" style={{ position: "absolute", zIndex: zIndex.notification, [v]: gutter.mobile, [h]: gutter.mobile, left: gutter.mobile, maxWidth: size }}>
      <View
        accessibilityLabel={accessibilityLabel}
        style={[{ gap: space[2], padding: space[4], borderRadius: radius.md, backgroundColor: c.card, borderWidth: borderWidth.thin, borderColor: c.divider }, nativeRaisedShadow(colorScheme), style]}
      >
        {withCloseButton && <CloseButton accessibilityLabel={closeButtonLabel} color="text2" onPress={onClose} style={{ position: "absolute", top: 0, right: 0 }} />}
        {children}
      </View>
    </Transition>
  );
}
