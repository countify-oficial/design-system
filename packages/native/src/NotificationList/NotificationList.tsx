import { useControllableState } from "@countify-oficial/hooks";
import { groupByDay, useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { borderWidth, fontSize, nativeFontFamily, space } from "@countify-oficial/tokens";
import type { ReactNode } from "react";
import { Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";
import { EmptyState } from "../EmptyState/EmptyState";
import { NavLink } from "../NavLink/NavLink";
import { Paper } from "../Paper/Paper";
import { SkeletonLoader } from "../SkeletonLoader/SkeletonLoader";
import { useThemeStyle } from "../styles";
import { Title } from "../Title/Title";

/** Um aviso da lista. */
export interface NotificationListItem {
  /** Identificador único: é o que `selected` e `onSelect` usam. */
  id: string;
  /** O título ("Câmera 2 sem imagem", "Ana Souza"). */
  title: ReactNode;
  /** A linha de baixo, em texto 2 (a loja). */
  description?: ReactNode;
  /** Quando aconteceu (Date, texto ISO ou milissegundos): agrupa por dia e mostra a hora. */
  date: Date | string | number;
  /** Antes do texto: um ThemeIcon (aviso do sistema) ou um Avatar (pessoa). */
  icon?: ReactNode;
  /** Ainda não lido: título em negrito e um ponto de destaque ao lado da hora. */
  unread?: boolean | undefined;
}

export interface NotificationListProps {
  /** Os avisos, do mais novo ao mais antigo: a lista agrupa por dia na ordem em que chegam (Hoje, Ontem, 12 de novembro). */
  items: NotificationListItem[];
  /** O aviso escolhido (controlado). No celular a escolha costuma abrir o detalhe em outra tela. */
  selected?: string | null | undefined;
  /** O aviso escolhido no começo (não controlado). */
  defaultSelected?: string | null | undefined;
  /** Toque num aviso: o app navega para o detalhe. */
  onSelect?: ((id: string, item: NotificationListItem) => void) | undefined;
  /** Mostra linhas cinza no lugar da lista (SkeletonLoader). */
  loading?: boolean | undefined;
  /** O que mostrar sem avisos. Padrão: EmptyState com "Nenhum aviso" do provider. */
  emptyState?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string | undefined;
}

/**
 * A lista dos Avisos (mockup M-Avisos): grupos por dia, cada um num cartão com linhas de 64 separadas pela divisória.
 * Os filtros (Todos · Pessoas · Sistema) e o detalhe são do app.
 */
// shortcut: desenha todos os avisos de uma vez (sem SectionList); trocar se a lista passar de algumas centenas
export function NotificationList(props: NotificationListProps) {
  const { messages, locale, colors: c } = useCountifyTheme();
  const { items, selected, defaultSelected, onSelect, loading, emptyState, style, testID } = useComponentProps("NotificationList", {}, props);
  const tema = useThemeStyle("NotificationList");
  const [escolhido, setEscolhido] = useControllableState<string | null>({ value: selected, defaultValue: defaultSelected ?? null });

  if (loading) return <SkeletonLoader variant="list" style={[tema, style]} testID={testID} />;
  if (items.length === 0) return <View style={[tema, style]} testID={testID}>{emptyState ?? <EmptyState title={messages.noNotifications} />}</View>;

  const grupos = groupByDay(items, (a) => new Date(a.date), { locale, today: messages.today, yesterday: messages.yesterday });
  return (
    <View style={[{ gap: space[6] }, tema, style]} testID={testID}>
      {grupos.map((g) => (
        <View key={g.key} style={{ gap: space[2] }}>
          <Title order={2} size="overline">{g.label}</Title>
          <Paper withBorder>
            {g.items.map((item, i) => {
              const hora = new Date(item.date).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
              const nome = [item.title, item.description, hora, item.unread && messages.unread].filter((v) => typeof v === "string").join(", ");
              return (
                <NavLink
                  key={item.id}
                  active={item.id === escolhido}
                  accessibilityLabel={nome}
                  onPress={() => {
                    setEscolhido(item.id);
                    onSelect?.(item.id, item);
                  }}
                  leftSection={item.icon}
                  label={
                    typeof item.title === "string" ? (
                      <RNText style={{ color: c.text, fontSize: fontSize.md, fontFamily: nativeFontFamily[item.unread ? 700 : 500] }}>{item.title}</RNText>
                    ) : (
                      item.title
                    )
                  }
                  description={item.description}
                  rightSection={
                    <View style={{ flexDirection: "row", alignItems: "center", gap: space[2] }}>
                      <RNText style={{ color: c.text2, fontSize: fontSize.sm, fontFamily: nativeFontFamily[400], fontVariant: ["tabular-nums"] }}>{hora}</RNText>
                      {/* aprovado em 18/11/2026: o mockup não desenha "não lido"; o ponto de 8 do Indicator, na cor de destaque */}
                      {item.unread && <View testID="unread-dot" style={{ width: space[2], height: space[2], borderRadius: space[1], backgroundColor: c.accent }} />}
                    </View>
                  }
                  style={[{ borderRadius: 0 }, i > 0 && { marginLeft: space[4], paddingLeft: 0, borderTopWidth: borderWidth.thin, borderColor: c.divider }]}
                />
              );
            })}
          </Paper>
        </View>
      ))}
    </View>
  );
}
