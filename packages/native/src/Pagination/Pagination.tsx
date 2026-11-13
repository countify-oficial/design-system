import { useControllableState } from "@countify-oficial/hooks";
import { paginationRange, useComponentProps, useCountifyTheme, useMessages } from "@countify-oficial/provider";
import { fontSize, nativeFontFamily, radius, space, state, touchTarget } from "@countify-oficial/tokens";
import type { ReactNode } from "react";
import { Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";
import { ContentColor } from "../contentColor";
import { Icon } from "../Icon/Icon";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";

export interface PaginationProps {
  total: number;
  value?: number | undefined;
  defaultValue?: number | undefined;
  onChange?: ((page: number) => void) | undefined;
  siblings?: number | undefined;
  boundaries?: number | undefined;
  withControls?: boolean | undefined;
  /** Os números das páginas. false mostra só as setas e o rótulo. Padrão: true. */
  withPages?: boolean | undefined;
  label?: ReactNode;
  disabled?: boolean | undefined;
  style?: StyleProp<ViewStyle>;
}

/** Paginação: setas e números (alvos de 44), com "…" nos saltos. */
export function Pagination(props: PaginationProps) {
  const messages = useMessages();
  const { total, value, defaultValue, onChange, siblings = 1, boundaries = 1, withControls = true, withPages = true, label, disabled, style } = useComponentProps("Pagination", {}, props);
  const { colors: c } = useCountifyTheme();
  const ultima = Math.max(1, total);
  const [pagina, setPagina] = useControllableState({ value, defaultValue: defaultValue ?? 1, onChange });
  const ir = (p: number) => setPagina(Math.max(1, Math.min(ultima, p)));
  const letra = { fontSize: fontSize.sm, fontVariant: ["tabular-nums" as const] };
  const botao = (chave: string | number, nome: string, desligado: boolean, atual: boolean, aoTocar: () => void, conteudo: ReactNode) => (
    <ContentColor key={chave} value={desligado ? c.text3 : atual ? c.accent : c.text}>
      <UnstyledButton
        accessibilityRole="button"
        accessibilityLabel={nome}
        accessibilityState={{ disabled: desligado, selected: atual }}
        disabled={desligado}
        onPress={aoTocar}
        style={({ pressed }) => [
          { minWidth: touchTarget, minHeight: touchTarget, paddingHorizontal: space[2], alignItems: "center", justifyContent: "center", borderRadius: radius.sm },
          atual && { backgroundColor: c.accentTint },
          pressed && { opacity: state.pressedOpacity },
        ]}
      >
        {conteudo}
      </UnstyledButton>
    </ContentColor>
  );
  return (
    <View accessibilityLabel={messages.pagination} style={[{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: space[1] }, style]}>
      {withControls && botao("ant", messages.previousPage, !!disabled || pagina <= 1, false, () => ir(pagina - 1), <Icon name="back" />)}
      {withPages
        ? paginationRange(ultima, pagina, siblings, boundaries).map((p, i) =>
            p === "dots" ? (
              <RNText key={`d${String(i)}`} accessible={false} style={[letra, { minWidth: touchTarget, textAlign: "center", color: c.text2, fontFamily: nativeFontFamily[400] }]}>…</RNText>
            ) : (
              botao(p, messages.page(p), !!disabled, p === pagina, () => ir(p), <RNText style={[letra, { color: p === pagina ? c.accent : c.text, fontFamily: nativeFontFamily[500] }]}>{p}</RNText>)
            ),
          )
        : <RNText style={[letra, { paddingHorizontal: space[2], color: c.text2, fontFamily: nativeFontFamily[400] }]}>{label ?? messages.stepOf(pagina, ultima)}</RNText>}
      {withControls && botao("prox", messages.nextPage, !!disabled || pagina >= ultima, false, () => ir(pagina + 1), <Icon name="chevron-right" />)}
    </View>
  );
}
