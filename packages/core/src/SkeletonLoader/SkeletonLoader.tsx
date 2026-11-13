import { useComponentProps, useMessages } from "@countify-oficial/provider";
import { skeletonStat, type Responsive } from "@countify-oficial/tokens";
import type { ComponentPropsWithRef } from "react";
import { Card } from "../Card/Card";
import { Paper } from "../Paper/Paper";
import { SimpleGrid } from "../SimpleGrid/SimpleGrid";
import { Skeleton } from "../Skeleton/Skeleton";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./SkeletonLoader.module.css";

/** text: linhas de texto; stat: cartões de número; list: linhas de lista com avatar; card: cartão com título e texto. */
export type SkeletonLoaderVariant = "text" | "stat" | "list" | "card";

export interface SkeletonLoaderProps
  extends StylesApiProps<"root" | "row" | "lines">, Omit<ComponentPropsWithRef<"div">, "className" | "style" | "children"> {
  /** A forma do conteúdo que vai chegar. Padrão: text. */
  variant?: SkeletonLoaderVariant | undefined;
  /** Quantas linhas (text, list) ou cartões (stat, card). Padrão: 3 em text e list, 1 em stat e card. */
  count?: number | undefined;
  /** Colunas dos cartões (stat, card), por ponto de quebra. Padrão: 1. */
  cols?: Responsive<number> | undefined;
  /** Pulsa. Padrão: true (para com "reduzir movimento"). */
  animate?: boolean | undefined;
  /** O que o leitor de tela anuncia. Padrão: "Carregando" do provider. */
  label?: string | undefined;
}

const linhas = (n: number, animate: boolean) =>
  Array.from({ length: n }, (_, i) => <Skeleton key={i} animate={animate} width={i === n - 1 && n > 1 ? "60%" : "100%"} />);

/**
 * O "Carregando" da Countify pronto: blocos cinza no formato do conteúdo (linhas, cartões de número, lista ou
 * cartão), sem girador. Ocupa o lugar do conteúdo; o layout não pula quando ele chega.
 */
export function SkeletonLoader(props: SkeletonLoaderProps) {
  const messages = useMessages();
  const { variant = "text", count, cols = 1, animate = true, label = messages.loading, className, style, classNames, styles, ...rest } =
    useComponentProps("SkeletonLoader", {}, props);
  const getStyles = useStyles("SkeletonLoader", classes, { className, style, classNames, styles });
  const n = count ?? (variant === "text" || variant === "list" ? 3 : 1);
  const vezes = Array.from({ length: n }, (_, i) => i);
  const status = { role: "status", "aria-busy": true, "aria-label": label, ...rest, "data-variant": variant } as const;

  if (variant === "text") return <div {...status} {...getStyles("root")}>{linhas(n, animate)}</div>;

  if (variant === "list") {
    return (
      <Paper {...status} withBorder {...getStyles("root")}>
        {vezes.map((i) => (
          <div key={i} {...getStyles("row")}>
            <Skeleton circle height={40} animate={animate} />
            <div {...getStyles("lines")}>
              <Skeleton width="60%" animate={animate} />
              <Skeleton width="40%" animate={animate} />
            </div>
          </div>
        ))}
      </Paper>
    );
  }

  return (
    <SimpleGrid {...status} cols={cols} spacing={3} {...getStyles("root")}>
      {vezes.map((i) =>
        variant === "stat" ? (
          <Card key={i} gap={3}>
            {(["label", "value", "detail"] as const).map((parte) => (
              <Skeleton key={parte} width={skeletonStat[parte].width} height={skeletonStat[parte].height} animate={animate} />
            ))}
          </Card>
        ) : (
          <Card key={i} gap={3}>
            <Skeleton width="50%" height={skeletonStat.value.height} animate={animate} />
            {linhas(3, animate)}
          </Card>
        ),
      )}
    </SimpleGrid>
  );
}
