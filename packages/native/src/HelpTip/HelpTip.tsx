import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { fontSize, helpIconSize, lineHeightPx, nativeFontFamily, sidePanelWidth, space, state, touchTarget } from "@countify-oficial/tokens";
import type { ReactNode } from "react";
import { Text as RNText, View, type PressableProps } from "react-native";
import { Icon } from "../Icon/Icon";
import { Popover } from "../Popover/Popover";
import { pressableStyle, useThemeStyle } from "../styles";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";

export interface HelpTipProps {
  /** Nome do botão e da explicação para o leitor de tela ("Ajuda: como é calculado o previsto"). */
  label: string;
  /** A explicação que o "?" mostra ao ser tocado: texto (em 15, na cor do texto) ou outros elementos. */
  children: ReactNode;
  /** Desliga o "?": não abre a explicação e fica esmaecido. */
  disabled?: boolean | undefined;
  /** Estilo do botão, ou função do estado ({ pressed }) que devolve o estilo. */
  style?: PressableProps["style"] | undefined;
}

/**
 * O "?" de ajuda: a explicação fica nele, fora da tela ("Pouco texto" do guia). Alvo redondo de 44 que não aumenta a
 * linha; o toque abre a explicação numa folha (o Popover do celular).
 */
export function HelpTip(props: HelpTipProps) {
  const { label, children, disabled, style } = useComponentProps("HelpTip", {}, props);
  const { colors: c } = useCountifyTheme();
  const tema = useThemeStyle("HelpTip");
  return (
    <Popover>
      <Popover.Target>
        <UnstyledButton
          accessibilityLabel={label}
          disabled={disabled}
          style={pressableStyle(style, ({ pressed }) => [
            // a margem negativa deixa o alvo de 44 sem aumentar a linha do título (24 de altura)
            { width: touchTarget, height: touchTarget, alignItems: "center", justifyContent: "center", borderRadius: touchTarget / 2, marginVertical: (space[6] - touchTarget) / 2 },
            pressed && { opacity: state.pressedOpacity },
            disabled && { opacity: state.disabledOpacity },
            tema,
          ])}
        >
          <Icon name="help" size={helpIconSize} color="text2" />
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown>
        <View accessibilityLabel={label} style={{ maxWidth: sidePanelWidth - 2 * space[6] }}>
          {typeof children === "string" ? (
            <RNText style={{ color: c.text, fontSize: fontSize.sm, lineHeight: lineHeightPx(fontSize.sm), fontFamily: nativeFontFamily[400] }}>{children}</RNText>
          ) : (
            children
          )}
        </View>
      </Popover.Dropdown>
    </Popover>
  );
}
