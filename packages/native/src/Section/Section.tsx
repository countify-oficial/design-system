import { hasContent, useComponentProps, useCountifyTheme, useMessages } from "@countify-oficial/provider";
import { fontSize, lineHeightPx, nativeFontFamily, space, touchTarget } from "@countify-oficial/tokens";
import type { ReactNode } from "react";
import { Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";
import { HelpTip } from "../HelpTip/HelpTip";
import { useThemeStyle } from "../styles";
import { Title } from "../Title/Title";

export interface SectionProps {
  /** O título da seção, em 20. */
  title: ReactNode;
  /** Nível do título (2 a 6), como na web. No celular o leitor de tela anuncia só "título". Padrão: 2. */
  order?: 2 | 3 | 4 | 5 | 6 | undefined;
  /** A explicação que o "?" ao lado do título mostra. Sem ela, não há "?". */
  help?: ReactNode;
  /** Nome do "?" para o leitor de tela. Padrão: "Ajuda" do provider e o título, quando o título é texto. */
  helpLabel?: string | undefined;
  /** À direita do título: um número ou texto curto (em 13, texto 2) ou a ação da seção (um Button). */
  aside?: ReactNode;
  /** O conteúdo da seção: campos direto sobre o fundo; lista e tabela, num cartão. */
  children?: ReactNode;
  /** Estilo da seção (a coluna com o cabeçalho e o conteúdo). */
  style?: StyleProp<ViewStyle>;
  /** Identificador da seção nos testes. */
  testID?: string | undefined;
}

/** Seção de uma tela: título de 20 com o "?" de ajuda, o que vai à direita e o conteúdo. */
export function Section(props: SectionProps) {
  const { title, order = 2, help, helpLabel, aside, children, style, testID } = useComponentProps("Section", {}, props);
  const { colors: c } = useCountifyTheme();
  const tema = useThemeStyle("Section");
  const messages = useMessages();
  const nomeDaAjuda = helpLabel ?? (typeof title === "string" ? `${messages.help}: ${title}` : messages.help);
  return (
    <View testID={testID} style={[{ gap: space[3] }, tema, style]}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: space[3], minHeight: touchTarget }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: space[1], flexShrink: 1 }}>
          <Title order={order} size="section" style={{ flexShrink: 1 }}>{title}</Title>
          {hasContent(help) && <HelpTip label={nomeDaAjuda}>{help}</HelpTip>}
        </View>
        {hasContent(aside) && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: space[2] }}>
            {typeof aside === "string" || typeof aside === "number" ? (
              <RNText style={{ color: c.text2, fontSize: fontSize.xs, lineHeight: lineHeightPx(fontSize.xs), fontFamily: nativeFontFamily[400], fontVariant: ["tabular-nums"] }}>{aside}</RNText>
            ) : (
              aside
            )}
          </View>
        )}
      </View>
      {children}
    </View>
  );
}
