import { highlighter } from "@countify-oficial/provider";
import type { Tone } from "@countify-oficial/tokens";
import type { ElementType } from "react";
import { Mark } from "../Mark/Mark";
import { Text, type TextProps } from "../Text/Text";

export type HighlightProps<C extends ElementType = "p"> = Omit<TextProps<C>, "children"> & {
  /** O que marcar: um termo ou vários. */
  highlight: string | string[];
  /** Tom da marca. Padrão: warn. */
  highlightColor?: Tone | undefined;
  /** O texto. */
  children: string;
};

/** Texto com os termos buscados marcados (resultado de busca, por exemplo). Aceita as props do Text. */
export function Highlight<C extends ElementType = "p">({ highlight, highlightColor, children, ...props }: HighlightProps<C>) {
  const texto = { ...props } as TextProps<C>;
  return (
    <Text {...texto}>
      {highlighter(children, highlight).map((p, i) => (p.highlighted ? <Mark key={i} color={highlightColor}>{p.chunk}</Mark> : p.chunk))}
    </Text>
  );
}
