import { useComponentProps, useMessages } from "@countify-oficial/provider";
import { screenHeaderHeight, space, state, touchTarget } from "@countify-oficial/tokens";
import type { ReactNode } from "react";
import { View, type GestureResponderEvent, type StyleProp, type ViewStyle } from "react-native";
import { Icon } from "../Icon/Icon";
import { useThemeStyle } from "../styles";
import { Title } from "../Title/Title";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";

export interface PageHeaderProps {
  /** O título da tela: 22 no celular e 28 a partir de 768. */
  title: ReactNode;
  /** Nome do voltar para o leitor de tela (a tela de origem, "Ajustes"). Padrão: "Voltar" do provider. */
  backLabel?: string | undefined;
  /** Toque no voltar. O voltar só aparece com onBack. */
  onBack?: ((e: GestureResponderEvent) => void) | undefined;
  /** As ações da tela, à direita (ActionIcon). */
  children?: ReactNode;
  /** Estilo do cabeçalho (a linha). */
  style?: StyleProp<ViewStyle>;
  /** Identificador do cabeçalho nos testes. */
  testID?: string | undefined;
}

/** Cabeçalho de tela: a seta redonda de voltar, o título e as ações à direita, numa linha de 60. */
export function PageHeader(props: PageHeaderProps) {
  const messages = useMessages();
  const { title, backLabel, onBack, children, style, testID } = useComponentProps("PageHeader", {}, props);
  const tema = useThemeStyle("PageHeader");
  return (
    <View testID={testID} style={[{ flexDirection: "row", alignItems: "center", gap: space[1], minHeight: screenHeaderHeight }, tema, style]}>
      {onBack !== undefined && (
        <UnstyledButton
          accessibilityLabel={backLabel ?? messages.back}
          onPress={onBack}
          style={({ pressed }) => [
            { width: touchTarget, height: touchTarget, alignItems: "center", justifyContent: "center", borderRadius: touchTarget / 2, marginLeft: -space[3] },
            pressed && { opacity: state.pressedOpacity },
          ]}
        >
          <Icon name="back" color="text" />
        </UnstyledButton>
      )}
      <Title order={1} style={{ flex: 1 }}>{title}</Title>
      {children !== undefined && children !== null && children !== false && <View style={{ flexDirection: "row", alignItems: "center", gap: space[2] }}>{children}</View>}
    </View>
  );
}
