import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { borderWidth, dialogWidth, gutter, nativeRaisedShadow, radius, space } from "@countify-oficial/tokens";
import type { ReactNode } from "react";
import { Modal as RNModal, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { CloseButton } from "../CloseButton/CloseButton";
import { Overlay } from "../Overlay/Overlay";
import { Title } from "../Title/Title";

export interface ModalBaseProps {
  opened: boolean;
  /** Chamado pelo botão de fechar, pelo toque no véu e pelo voltar do Android. */
  onClose: () => void;
  title?: ReactNode;
  withCloseButton?: boolean | undefined;
  closeButtonLabel?: string | undefined;
  /** Toque no véu fecha. Padrão: true. */
  closeOnClickOutside?: boolean | undefined;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string | undefined;
}

export interface ModalProps extends ModalBaseProps {
  /** Largura máxima. Padrão: 440. */
  size?: number | undefined;
  fullScreen?: boolean | undefined;
}

/** Janela sobre a tela (o Modal do sistema), com o véu. O leitor de tela fica dentro (accessibilityViewIsModal). */
export function Modal(props: ModalProps) {
  const { opened, onClose, title, withCloseButton = true, closeButtonLabel, closeOnClickOutside = true, size = dialogWidth, fullScreen, children, style, testID } = useComponentProps("Modal", {}, props);
  const { colors: c, colorScheme } = useCountifyTheme();
  return (
    <RNModal visible={opened} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={[StyleSheet.absoluteFill, { alignItems: "center", justifyContent: "center", padding: fullScreen ? 0 : gutter.mobile }]}>
        <Overlay />
        <Pressable accessible={false} style={StyleSheet.absoluteFill} onPress={closeOnClickOutside ? onClose : undefined} />
        <View
          testID={testID}
          accessibilityViewIsModal
          style={[
            { width: "100%", maxWidth: fullScreen ? undefined : size, gap: space[2], padding: space[6], backgroundColor: c.card, borderRadius: fullScreen ? 0 : radius.md, borderWidth: borderWidth.thin, borderColor: c.divider },
            fullScreen && { flex: 1 },
            nativeRaisedShadow(colorScheme),
            style,
          ]}
        >
          {(title !== undefined || withCloseButton) && (
            <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: space[3] }}>
              {typeof title === "string" ? <Title order={2} size="section" style={{ flex: 1 }}>{title}</Title> : title}
              {withCloseButton && <CloseButton accessibilityLabel={closeButtonLabel} color="text2" onPress={onClose} style={{ margin: -space[3], marginLeft: 0 }} />}
            </View>
          )}
          {children}
        </View>
      </View>
    </RNModal>
  );
}
