import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { borderWidth, filterChipChevronSize, fontSize, nativeFontFamily, radius, space, state, touchTarget } from "@countify-oficial/tokens";
import type { ElementType, ReactNode } from "react";
import { Pressable, Text as RNText, type AccessibilityState, type PressableProps } from "react-native";
import { ContentColor } from "../contentColor";
import { Icon } from "../Icon/Icon";
import type { PolymorphicProps } from "../polymorphic";
import { pressableStyle, useThemeStyle } from "../styles";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";

export interface FilterChipOwnProps {
  /** Há um filtro aplicado, diferente do padrão: tinta e anel do destaque (o leitor de tela anuncia "selecionado"). */
  active?: boolean | undefined;
  /** Ícone antes do texto; recebe a cor do chip. */
  leftSection?: ReactNode;
  /** Desliga o chip: não responde ao toque e fica esmaecido. */
  disabled?: boolean | undefined;
  /** Estado para o leitor de tela; soma-se a selected (active) e disabled. O Menu.Target põe expanded aqui. */
  accessibilityState?: AccessibilityState | undefined;
  /** A escolha atual ("Hoje", "Marca · Lume"): texto (vira Text com a letra do chip) ou outros elementos. */
  children?: ReactNode;
  /** Estilo, ou função do estado ({ pressed }) que devolve o estilo. */
  style?: PressableProps["style"] | undefined;
}

export type FilterChipProps<C extends ElementType = typeof Pressable> = PolymorphicProps<C, FilterChipOwnProps>;

/**
 * Chip de filtro: o único padrão de filtro do guia. Mostra a escolha e abre a lista de opções; é o alvo de um Menu ou
 * de um Popover (a folha, no celular).
 */
export function FilterChip<C extends ElementType = typeof Pressable>(props: FilterChipProps<C>) {
  const { component, active, leftSection, disabled, accessibilityState, children, style, ...rest } = useComponentProps("FilterChip", {}, props);
  const { colors: c } = useCountifyTheme();
  const tema = useThemeStyle("FilterChip");
  const fg = active ? c.accent : c.text;
  return (
    <ContentColor value={fg}>
      <UnstyledButton
        component={component as ElementType}
        disabled={disabled}
        accessibilityState={{ selected: !!active, disabled: !!disabled, ...accessibilityState }}
        {...rest}
        style={pressableStyle(style, ({ pressed }) => [
          {
            flexDirection: "row", alignItems: "center", gap: space[2], minHeight: touchTarget, paddingHorizontal: space[3], borderRadius: radius.sm,
            backgroundColor: active ? c.accentTint : c.card, borderWidth: active ? borderWidth.thick : borderWidth.thin, borderColor: active ? c.accent : c.divider,
          },
          pressed && { opacity: state.pressedOpacity },
          disabled && { opacity: state.disabledOpacity },
          tema,
        ])}
      >
        {leftSection}
        {typeof children === "string" ? (
          <RNText numberOfLines={1} style={{ flexShrink: 1, color: fg, fontSize: fontSize.sm, fontFamily: nativeFontFamily[500] }}>{children}</RNText>
        ) : (
          children
        )}
        <Icon name="chevron-down" size={filterChipChevronSize} />
      </UnstyledButton>
    </ContentColor>
  );
}
