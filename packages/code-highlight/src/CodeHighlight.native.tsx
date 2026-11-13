import { useClipboard } from "@countify-oficial/hooks";
import { UnstyledButton } from "@countify-oficial/native";
import { useComponentProps, useCountifyTheme, useMessages } from "@countify-oficial/provider";
import { fontSize, lineHeightPx, nativeFontFamily, nativeMonoFontFamily, radius, space, touchTarget, type ColorRole } from "@countify-oficial/tokens";
import type { ReactNode } from "react";
import { ScrollView, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { tokenizeLines, type CodeLanguage, type TokenKind } from "./tokenize";

const COR: Record<TokenKind, ColorRole> = { keyword: "accent", string: "up", number: "warn", comment: "text3", property: "label", punctuation: "text2", plain: "text" };

export interface CodeHighlightProps {
  code: string;
  language?: CodeLanguage | undefined;
  withCopyButton?: boolean | undefined;
  withLineNumbers?: boolean | undefined;
  title?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Bloco de código com realce e o link "Copiar"; rola para o lado. */
export function CodeHighlight(props: CodeHighlightProps) {
  const messages = useMessages();
  const { colors: c } = useCountifyTheme();
  const { code, language = "tsx", withCopyButton = true, withLineNumbers = false, title, style } = useComponentProps("CodeHighlight", {}, props);
  const { copied, copy } = useClipboard();
  const linhas = tokenizeLines(code.replace(/\n$/, ""), language);
  const mono = { fontFamily: nativeMonoFontFamily[400], fontSize: fontSize.sm, lineHeight: lineHeightPx(fontSize.sm) };
  return (
    <View style={[{ gap: space[1] }, style]}>
      {(title !== undefined || withCopyButton) && (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: space[3] }}>
          {typeof title === "string" ? <Text style={{ color: c.text2, fontSize: fontSize.xs, fontFamily: nativeFontFamily[400] }}>{title}</Text> : title}
          {withCopyButton && (
            <UnstyledButton accessibilityRole="button" onPress={() => void copy(code)} style={{ minHeight: touchTarget, justifyContent: "center", marginLeft: "auto" }}>
              <Text accessibilityLiveRegion="polite" style={{ color: c.accent, fontSize: fontSize.sm, fontFamily: nativeFontFamily[500] }}>{copied ? messages.copied : messages.copy}</Text>
            </UnstyledButton>
          )}
        </View>
      )}
      <ScrollView horizontal style={{ borderRadius: radius.sm, backgroundColor: c.field }} contentContainerStyle={{ padding: space[4] }}>
        <View>
          {linhas.map((linha, i) => (
            <View key={i} style={{ flexDirection: "row" }}>
              {withLineNumbers && <Text style={[mono, { color: c.text3, minWidth: space[6], marginRight: space[4], textAlign: "right" }]}>{i + 1}</Text>}
              <Text style={[mono, { color: c.text }]}>
                {linha.map((t, j) => <Text key={j} style={{ color: c[COR[t.kind]] }}>{t.text}</Text>)}
                {linha.length === 0 ? " " : ""}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
