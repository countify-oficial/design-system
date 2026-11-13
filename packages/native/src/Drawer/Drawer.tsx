import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { borderWidth, gutter, nativeRaisedShadow, radius, sheetHandle, sidePanelWidth, space, type Responsive } from "@countify-oficial/tokens";
import { Modal as RNModal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { CloseButton } from "../CloseButton/CloseButton";
import type { ModalBaseProps } from "../Modal/Modal";
import { Overlay } from "../Overlay/Overlay";
import { useResponsive } from "../styles";
import { Title } from "../Title/Title";

export type DrawerPosition = "bottom" | "right" | "left";

export interface DrawerProps extends ModalBaseProps {
  /** Pela largura da tela. Padrão: bottom (folha que sobe) no celular e right (painel de 380) a partir de 768 (tablet). */
  position?: Responsive<DrawerPosition> | undefined;
  /** Largura do painel (right e left). Padrão: 380. */
  size?: number | undefined;
}

/** Folha que sobe no celular (topo de 24, alça) e painel lateral no tablet, sobre o véu. */
export function Drawer(props: DrawerProps) {
  const { opened, onClose, title, withCloseButton = true, closeButtonLabel, closeOnClickOutside = true, position = { base: "bottom", sm: "right" }, size = sidePanelWidth, children, style, testID } =
    useComponentProps("Drawer", {}, props);
  const { colors: c, colorScheme } = useCountifyTheme();
  const pos = useResponsive<DrawerPosition>(position);
  const folha = pos === "bottom";
  return (
    <RNModal visible={opened} transparent animationType={folha ? "slide" : "fade"} onRequestClose={onClose} statusBarTranslucent>
      <View style={[StyleSheet.absoluteFill, { flexDirection: folha ? "column" : "row", justifyContent: folha ? "flex-end" : pos === "right" ? "flex-end" : "flex-start" }]}>
        <Overlay />
        <Pressable accessible={false} style={StyleSheet.absoluteFill} onPress={closeOnClickOutside ? onClose : undefined} />
        <View
          testID={testID}
          accessibilityViewIsModal
          style={[
            { backgroundColor: c.sheet, gap: space[5] },
            folha
              ? { maxHeight: "92%", borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, paddingTop: space[2], paddingHorizontal: gutter.mobile, paddingBottom: space[5] + space[6] }
              : { width: size, maxWidth: "100%", height: "100%", padding: space[6], borderColor: c.divider, [pos === "right" ? "borderLeftWidth" : "borderRightWidth"]: borderWidth.thin },
            nativeRaisedShadow(colorScheme),
            style,
          ]}
        >
          {folha && <View accessible={false} style={{ alignSelf: "center", width: sheetHandle.width, height: sheetHandle.height, borderRadius: sheetHandle.height / 2, backgroundColor: c.borderStrong }} />}
          {(title !== undefined || withCloseButton) && (
            <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: space[3] }}>
              {typeof title === "string" ? <Title order={2} size="screenTitle" style={{ flex: 1 }}>{title}</Title> : title}
              {withCloseButton && <CloseButton accessibilityLabel={closeButtonLabel} color="text2" onPress={onClose} style={{ margin: -space[3], marginLeft: 0 }} />}
            </View>
          )}
          <ScrollView contentContainerStyle={{ gap: space[4] }} keyboardShouldPersistTaps="handled">{children}</ScrollView>
        </View>
      </View>
    </RNModal>
  );
}
