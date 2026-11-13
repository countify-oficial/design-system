import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { controlHeight, radius as cantos, state, borderWidth, type ColorRole, type Size } from "@countify-oficial/tokens";
import type { ElementType, ReactNode } from "react";
import { Pressable, type PressableProps } from "react-native";
import { ContentColor } from "../contentColor";
import { Loader } from "../Loader/Loader";
import type { PolymorphicProps } from "../polymorphic";
import { pressableStyle, useThemeStyle } from "../styles";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";

/** subtle: sem fundo (Voltar); default: cartão com anel (Editar); filled: fundo de chip. */
export type ActionIconVariant = "subtle" | "default" | "filled";

export interface ActionIconOwnProps {
  /** O nome para o leitor de tela: o ícone sozinho não diz nada. */
  accessibilityLabel: string;
  /** Padrão: subtle. */
  variant?: ActionIconVariant | undefined;
  /** Papel de cor do ícone. Padrão: text. */
  color?: ColorRole | undefined;
  /** Lado do quadrado: xs/sm 44, md 52, lg 56, xl 64. Padrão: sm (44, o alvo de toque). */
  size?: Size | undefined;
  /** Canto: xs 8, sm 12, md 16, lg 20, xl 24. Padrão: sm. */
  radius?: Size | undefined;
  disabled?: boolean | undefined;
  /** Girador no lugar do ícone; desliga o botão. */
  loading?: boolean | undefined;
  /** O ícone; recebe a cor. */
  children?: ReactNode;
  style?: PressableProps["style"] | undefined;
}

export type ActionIconProps<C extends ElementType = typeof Pressable> = PolymorphicProps<C, ActionIconOwnProps>;

/** Botão só com ícone, com nome para o leitor de tela. */
export function ActionIcon<C extends ElementType = typeof Pressable>(props: ActionIconProps<C>) {
  const { component, variant = "subtle", color = "text", size = "sm", radius = "sm", disabled, loading, children, style, ...rest } =
    useComponentProps("ActionIcon", {}, props);
  const { colors: c } = useCountifyTheme();
  const tema = useThemeStyle("ActionIcon");
  const lado = controlHeight.button[size];
  return (
    <ContentColor value={c[color]}>
      <UnstyledButton
        component={component as ElementType}
        disabled={disabled || loading}
        accessibilityState={{ busy: !!loading }}
        {...rest}
        style={pressableStyle(style, ({ pressed }) => [
          { width: lado, height: lado, alignItems: "center", justifyContent: "center", borderRadius: cantos[radius] },
          variant === "default" && { backgroundColor: c.card, borderWidth: borderWidth.thin, borderColor: c.divider },
          variant === "filled" && { backgroundColor: c.chip },
          pressed && { opacity: state.pressedOpacity },
          disabled && !loading && { opacity: state.disabledOpacity },
          tema,
        ])}
      >
        {loading ? <Loader size="sm" label={false} /> : children}
      </UnstyledButton>
    </ContentColor>
  );
}
