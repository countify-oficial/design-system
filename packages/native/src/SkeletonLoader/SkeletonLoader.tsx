import { useComponentProps, useCountifyTheme, useMessages } from "@countify-oficial/provider";
import { borderWidth, listRowHeight, skeletonStat, space, type Responsive } from "@countify-oficial/tokens";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { Card } from "../Card/Card";
import { Paper } from "../Paper/Paper";
import { SimpleGrid } from "../SimpleGrid/SimpleGrid";
import { Skeleton } from "../Skeleton/Skeleton";

/** text: linhas de texto; stat: cartões de número; list: linhas de lista com avatar; card: cartão com título e texto. */
export type SkeletonLoaderVariant = "text" | "stat" | "list" | "card";

export interface SkeletonLoaderProps {
  /** A forma do conteúdo que vai chegar. Padrão: text. */
  variant?: SkeletonLoaderVariant | undefined;
  /** Quantas linhas (text, list) ou cartões (stat, card). Padrão: 3 em text e list, 1 em stat e card. */
  count?: number | undefined;
  /** Colunas dos cartões (stat, card), pela largura da tela. Padrão: 1. */
  cols?: Responsive<number> | undefined;
  /** Pulsa. Padrão: true (para com "reduzir movimento"). */
  animate?: boolean | undefined;
  /** O que o leitor de tela anuncia. Padrão: "Carregando" do provider. */
  label?: string | undefined;
  style?: StyleProp<ViewStyle>;
  testID?: string | undefined;
}

const linhas = (n: number, animate: boolean) =>
  Array.from({ length: n }, (_, i) => <Skeleton key={i} animate={animate} width={i === n - 1 && n > 1 ? "60%" : "100%"} />);

/** O "Carregando" da Countify pronto: blocos cinza no formato do conteúdo, sem girador. */
export function SkeletonLoader(props: SkeletonLoaderProps) {
  const messages = useMessages();
  const { variant = "text", count, cols = 1, animate = true, label = messages.loading, style, testID } = useComponentProps("SkeletonLoader", {}, props);
  const { colors: c } = useCountifyTheme();
  const n = count ?? (variant === "text" || variant === "list" ? 3 : 1);
  const vezes = Array.from({ length: n }, (_, i) => i);
  const status = { accessible: true, accessibilityLabel: label, accessibilityState: { busy: true }, testID } as const;

  if (variant === "text") return <View {...status} style={[{ gap: space[2] }, style]}>{linhas(n, animate)}</View>;

  if (variant === "list") {
    return (
      <Paper {...status} withBorder style={style}>
        {vezes.map((i) => (
          <View
            key={i}
            style={[
              { flexDirection: "row", alignItems: "center", gap: space[3], minHeight: listRowHeight, paddingVertical: space[3], paddingHorizontal: space[4] },
              i > 0 && { marginLeft: space[4], paddingLeft: 0, borderTopWidth: borderWidth.thin, borderColor: c.divider },
            ]}
          >
            <Skeleton circle height={40} animate={animate} />
            <View style={{ flex: 1, gap: space[2] }}>
              <Skeleton width="60%" animate={animate} />
              <Skeleton width="40%" animate={animate} />
            </View>
          </View>
        ))}
      </Paper>
    );
  }

  return (
    <SimpleGrid {...status} cols={cols} spacing={3} style={style}>
      {vezes.map((i) => (
        <Card key={i} gap={3}>
          {variant === "stat"
            ? (["label", "value", "detail"] as const).map((parte) => (
                <Skeleton key={parte} width={skeletonStat[parte].width} height={skeletonStat[parte].height} animate={animate} />
              ))
            : [<Skeleton key="t" width="50%" height={skeletonStat.value.height} animate={animate} />, ...linhas(3, animate)]}
        </Card>
      ))}
    </SimpleGrid>
  );
}
