import { Center, Text } from "@countify-oficial/core";
import type { CSSProperties, ReactNode } from "react";

/** Bloco de exemplo para as histórias de layout, nas cores dos tokens. */
export function Bloco({ children, style }: { children?: ReactNode; style?: CSSProperties }) {
  return (
    <Center
      style={{
        minHeight: "var(--cf-touch-target)",
        padding: "var(--cf-space-2) var(--cf-space-4)",
        borderRadius: "var(--cf-radius-xs)",
        background: "var(--cf-color-accent-tint)",
        ...style,
      }}
    >
      <Text component="span" size="sm" color="accent" weight="medium">{children}</Text>
    </Center>
  );
}

/** Moldura para ver o tamanho de um layout. */
export const moldura: CSSProperties = { boxShadow: "var(--cf-shadow-xs)", borderRadius: "var(--cf-radius-sm)" };
