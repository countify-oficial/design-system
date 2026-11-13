import { highlighter } from "@countify-oficial/provider";
import type { Tone } from "@countify-oficial/tokens";
import { Mark } from "../Mark/Mark";
import { Text, type TextProps } from "../Text/Text";

export type HighlightProps = Omit<TextProps, "children"> & {
  /** O que marcar: um termo ou vários. */
  highlight: string | string[];
  /** Tom da marca. Padrão: warn. */
  highlightColor?: Tone | undefined;
  children: string;
};

/** Texto com os termos buscados marcados. Aceita as props do Text. */
export function Highlight({ highlight, highlightColor, children, ...props }: HighlightProps) {
  return (
    <Text {...(props)}>
      {highlighter(children, highlight).map((p, i) => (p.highlighted ? <Mark key={i} color={highlightColor}>{p.chunk}</Mark> : p.chunk))}
    </Text>
  );
}
