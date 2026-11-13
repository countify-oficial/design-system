import { useControllableState } from "@countify-oficial/hooks";
import { useComponentProps, useCountifyTheme, useMessages, type TreeNode } from "@countify-oficial/provider";
import { fontSize, nativeFontFamily, space, state, touchTarget } from "@countify-oficial/tokens";
import { useState } from "react";
import { Text as RNText, View } from "react-native";
import { ChoiceField, type ChoiceFieldProps } from "../Combobox/ChoiceField";
import { Combobox } from "../Combobox/Combobox";
import { ContentColor } from "../contentColor";
import { Icon } from "../Icon/Icon";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";

export interface CascaderProps extends ChoiceFieldProps {
  data: TreeNode[];
  /** O caminho escolhido (os valores do primeiro nível até o último). */
  value?: string[] | undefined;
  defaultValue?: string[] | undefined;
  onChange?: ((path: string[], nodes: TreeNode[]) => void) | undefined;
  /** Aceita escolher um pai (não só a última camada). */
  changeOnSelect?: boolean | undefined;
  /** Entre os rótulos no campo. Padrão: " / ". */
  separator?: string | undefined;
}

function nosDoCaminho(data: TreeNode[], p: string[]): TreeNode[] {
  const lista: TreeNode[] = [];
  let nivel: TreeNode[] | undefined = data;
  for (const v of p) {
    const no: TreeNode | undefined = nivel?.find((n) => n.value === v);
    if (!no) break;
    lista.push(no);
    nivel = no.children;
  }
  return lista;
}

/** Escolhe por camadas numa folha que sobe: tocar num pai entra nele; Voltar sobe uma camada; a folha escolhe e fecha. */
export function Cascader(props: CascaderProps) {
  const messages = useMessages();
  const { data, value, defaultValue, onChange, changeOnSelect, separator = " / ", label, ...campo } = useComponentProps("Cascader", {}, props);
  const { colors: c } = useCountifyTheme();
  const [caminho, setCaminho] = useControllableState<string[]>({ value, defaultValue: defaultValue ?? [], onChange: (p) => onChange?.(p, nosDoCaminho(data, p)) });
  const [aberto, setAberto] = useState(false);
  const [rascunho, setRascunho] = useState<string[]>([]);
  const dentro = nosDoCaminho(data, rascunho);
  const nivel = dentro.at(-1)?.children ?? data;
  return (
    <Combobox
      opened={aberto}
      onOpenedChange={(v) => {
        setAberto(v);
        setRascunho([]);
      }}
      title={dentro.at(-1)?.label ?? label}
      onOptionSubmit={(v) => {
        const no = nivel.find((n) => n.value === v);
        if (!no) return;
        const novo = [...rascunho, v];
        if (!no.children?.length || changeOnSelect) setCaminho(novo);
        if (no.children?.length) setRascunho(novo);
        else setAberto(false);
      }}
    >
      <ChoiceField {...campo} label={label} valor={nosDoCaminho(data, caminho).map((n) => n.label).join(separator) || undefined} aberto={aberto} onPress={() => { setRascunho([]); setAberto(true); }} />
      <Combobox.Dropdown>
        {rascunho.length > 0 && (
          <ContentColor value={c.accent}>
            <UnstyledButton
              accessibilityRole="button"
              accessibilityLabel={messages.back}
              onPress={() => setRascunho(rascunho.slice(0, -1))}
              style={({ pressed }) => [{ flexDirection: "row", alignItems: "center", gap: space[2], minHeight: touchTarget }, pressed && { opacity: state.pressedOpacity }]}
            >
              <Icon name="back" size="sm" />
              <RNText style={{ color: c.accent, fontSize: fontSize.md, fontFamily: nativeFontFamily[500] }}>{messages.back}</RNText>
            </UnstyledButton>
          </ContentColor>
        )}
        {nivel.map((no) => (
          <Combobox.Option key={no.value} value={no.value} disabled={no.disabled} selected={rascunho.every((v, k) => caminho[k] === v) && caminho[rascunho.length] === no.value}>
            {no.children?.length ? (
              <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                <RNText style={{ flex: 1, color: c.text, fontSize: fontSize.md, fontFamily: nativeFontFamily[400] }}>{no.label}</RNText>
                <ContentColor value={c.text2}><Icon name="chevron-right" size="sm" /></ContentColor>
              </View>
            ) : (
              no.label
            )}
          </Combobox.Option>
        ))}
      </Combobox.Dropdown>
    </Combobox>
  );
}
