import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import {
  controlFontSize, controlHeight, controlPaddingX, nativeFontFamily, radius as cantos, space, state, borderWidth,
  type Responsive, type Size,
} from "@countify-oficial/tokens";
import { Children, createContext, useContext, type ElementType, type ReactNode } from "react";
import { Pressable, Text as RNText, View, type PressableProps, type StyleProp, type ViewStyle } from "react-native";
import { ContentColor } from "../contentColor";
import { Loader } from "../Loader/Loader";
import type { PolymorphicProps } from "../polymorphic";
import { pressableStyle, useResponsive, useThemeStyle } from "../styles";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";

/**
 * filled: principal (um por tela); outline: Cancelar; subtle: só texto (Excluir, com color="down"); dashed: adicionar;
 * link: com cara de link (texto na cor, sem fundo nem borda), com a altura e o alvo de toque do botão.
 */
export type ButtonVariant = "filled" | "outline" | "subtle" | "dashed" | "link";
/** accent: o azul do botão; down, up e warn: as cores de queda, alta e aviso. */
export type ButtonColor = "accent" | "down" | "up" | "warn";

export interface ButtonOwnProps {
  /** filled, outline, subtle, dashed ou link (aparência do Anchor, com a altura do botão). Padrão: filled. */
  variant?: ButtonVariant | undefined;
  /** Padrão: accent. */
  color?: ButtonColor | undefined;
  /** Altura, recuo e letra: xs/sm 44, md 52, lg 56, xl 64. Por ponto de quebra; padrão: md, e sm a partir de 768 (tablet). */
  size?: Responsive<Size> | undefined;
  /** Canto: xs 8, sm 12, md 16, lg 20, xl 24. Padrão: sm. */
  radius?: Size | undefined;
  /** Ocupa a largura toda (numa coluna, o botão já ocupa). */
  fullWidth?: boolean | undefined;
  disabled?: boolean | undefined;
  /** Mostra o girador no lugar do ícone da esquerda e desliga o botão. */
  loading?: boolean | undefined;
  /** Antes do texto (um Icon, por exemplo); recebe a cor do botão. */
  leftSection?: ReactNode;
  /** Depois do texto. */
  rightSection?: ReactNode;
  /** Texto (vira Text com a letra do botão) ou outros elementos. */
  children?: ReactNode;
  style?: PressableProps["style"] | undefined;
}

export type ButtonProps<C extends ElementType = typeof Pressable> = PolymorphicProps<C, ButtonOwnProps>;

const padrao: Responsive<Size> = { base: "md", sm: "sm" };

/** Lugar do botão dentro do Button.Group. */
interface Encaixe {
  orientation: "horizontal" | "vertical";
  first: boolean;
  last: boolean;
}
const GroupContext = createContext<Encaixe | null>(null);

// cantos só nas pontas; o seguinte entra uma borda fina no anterior (a borda é uma só)
function encaixar({ orientation, first, last }: Encaixe): ViewStyle {
  return orientation === "horizontal"
    ? {
        ...(!first && { marginLeft: -borderWidth.thin, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }),
        ...(!last && { borderTopRightRadius: 0, borderBottomRightRadius: 0 }),
      }
    : {
        ...(!first && { marginTop: -borderWidth.thin, borderTopLeftRadius: 0, borderTopRightRadius: 0 }),
        ...(!last && { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }),
      };
}

/** Botão da Countify (Pressable), com as mesmas variantes e cores da web. */
function ButtonRoot<C extends ElementType = typeof Pressable>(props: ButtonProps<C>) {
  const {
    component, variant = "filled", color = "accent", size = padrao, radius = "sm", fullWidth, disabled, loading,
    leftSection, rightSection, children, style, ...rest
  } = useComponentProps("Button", {}, props);
  const { colors: c } = useCountifyTheme();
  const tema = useThemeStyle("Button");
  const encaixe = useContext(GroupContext);
  const t = useResponsive(size);
  const cor = {
    accent: { texto: c.accent, fundo: c.button, sobre: c.onButton },
    down: { texto: c.down, fundo: c.down, sobre: c.bg },
    up: { texto: c.up, fundo: c.up, sobre: c.bg },
    warn: { texto: c.warn, fundo: c.warn, sobre: c.bg },
  }[color];
  const fg = variant === "filled" ? cor.sobre : variant === "subtle" || variant === "link" || (variant === "outline" && color !== "accent") ? cor.texto : c.text;
  const texto = typeof children === "string" || typeof children === "number";
  return (
    <ContentColor value={fg}>
      <UnstyledButton
        component={component as ElementType}
        disabled={disabled || loading}
        accessibilityState={{ busy: !!loading }}
        {...rest}
        style={pressableStyle(style, ({ pressed }) => [
          {
            flexDirection: "row", alignItems: "center", justifyContent: "center", gap: space[2],
            minHeight: controlHeight.button[t], paddingHorizontal: controlPaddingX[t], borderRadius: cantos[radius],
          },
          variant === "filled" && { backgroundColor: cor.fundo },
          variant === "outline" && { borderWidth: borderWidth.thin, borderColor: c.borderStrong },
          variant === "dashed" && { borderWidth: borderWidth.thick, borderStyle: "dashed", borderColor: c.text3 },
          fullWidth && { alignSelf: "stretch" },
          encaixe && encaixar(encaixe),
          // aprovado em 18/11/2026: filled sem borda ficaria um bloco só; a linha entre eles é fina e na cor do texto do botão
          encaixe && !encaixe.first && variant === "filled" && {
            [encaixe.orientation === "horizontal" ? "borderLeftWidth" : "borderTopWidth"]: borderWidth.thin,
            borderColor: cor.sobre,
          },
          pressed && { opacity: state.pressedOpacity },
          disabled && !loading && { opacity: state.disabledOpacity },
          tema,
        ])}
      >
        {loading ? <Loader size="sm" label={false} /> : leftSection}
        {texto ? (
          <RNText
            numberOfLines={1}
            style={{ color: fg, fontSize: controlFontSize[t], fontFamily: nativeFontFamily[variant === "filled" ? 700 : 500] }}
          >
            {children}
          </RNText>
        ) : (
          children
        )}
        {rightSection}
      </UnstyledButton>
    </ContentColor>
  );
}

export interface ButtonGroupProps {
  /** O nome do grupo para o leitor de tela ("Período", "Alinhamento"). */
  accessibilityLabel: string;
  /** Lado a lado (horizontal) ou um embaixo do outro (vertical). Padrão: horizontal. */
  orientation?: "horizontal" | "vertical" | undefined;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Botões encostados (role group): sem vão, cantos só nas pontas e a borda compartilhada. */
export function ButtonGroup(props: ButtonGroupProps) {
  const { accessibilityLabel, orientation = "horizontal", children, style } = useComponentProps("ButtonGroup", {}, props);
  const itens = Children.toArray(children);
  return (
    <View role="group" accessibilityLabel={accessibilityLabel} style={[{ flexDirection: orientation === "horizontal" ? "row" : "column" }, style]}>
      {itens.map((item, i) => (
        <GroupContext key={i} value={{ orientation, first: i === 0, last: i === itens.length - 1 }}>
          {item}
        </GroupContext>
      ))}
    </View>
  );
}

/** Botão da Countify. Button.Group encosta vários. */
export const Button = Object.assign(ButtonRoot, { Group: ButtonGroup });
