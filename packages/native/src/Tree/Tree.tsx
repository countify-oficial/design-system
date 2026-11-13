import { useControllableState } from "@countify-oficial/hooks";
import { treeCheckState, treeLeaves, useComponentProps, useCountifyTheme, type TreeNode } from "@countify-oficial/provider";
import { fontSize, nativeFontFamily, radius, space, state, touchTarget } from "@countify-oficial/tokens";
import { Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";
import { CaixaDeMarcar } from "../Checkbox/Checkbox";
import { ContentColor } from "../contentColor";
import { Icon } from "../Icon/Icon";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";

export interface TreeProps {
  data: TreeNode[];
  expanded?: string[] | undefined;
  defaultExpanded?: string[] | undefined;
  onExpandedChange?: ((expanded: string[]) => void) | undefined;
  selected?: string | null | undefined;
  defaultSelected?: string | null | undefined;
  onSelect?: ((value: string, node: TreeNode) => void) | undefined;
  /** Caixas de marcar: marcar um pai marca as folhas de baixo; o pai fica meio marcado com só algumas. */
  withCheckboxes?: boolean | undefined;
  checked?: string[] | undefined;
  defaultChecked?: string[] | undefined;
  onCheckedChange?: ((checked: string[]) => void) | undefined;
  /** Só folhas podem ser escolhidas (sem caixas). */
  leavesOnly?: boolean | undefined;
  style?: StyleProp<ViewStyle>;
}

/** Árvore: tocar num pai abre ou fecha; tocar numa folha escolhe (ou marca, com caixas). Linhas de 44. */
export function Tree(props: TreeProps) {
  const { data, expanded, defaultExpanded, onExpandedChange, selected, defaultSelected, onSelect, withCheckboxes, checked, defaultChecked, onCheckedChange, leavesOnly, style } =
    useComponentProps("Tree", {}, props);
  const { colors: c } = useCountifyTheme();
  const [abertos, setAbertos] = useControllableState<string[]>({ value: expanded, defaultValue: defaultExpanded ?? [], onChange: onExpandedChange });
  const [escolhido, setEscolhido] = useControllableState<string | null>({ value: selected, defaultValue: defaultSelected ?? null });
  const [marcados, setMarcados] = useControllableState<string[]>({ value: checked, defaultValue: defaultChecked ?? [], onChange: onCheckedChange });
  const alternar = (v: string) => setAbertos(abertos.includes(v) ? abertos.filter((x) => x !== v) : [...abertos, v]);
  const tocar = (no: TreeNode) => {
    const temFilhos = !!no.children?.length;
    if (withCheckboxes) {
      const folhas = treeLeaves(no);
      setMarcados(treeCheckState(no, marcados) === "all" ? marcados.filter((m) => !folhas.includes(m)) : [...new Set([...marcados, ...folhas])]);
      return;
    }
    if (temFilhos) alternar(no.value);
    if (leavesOnly && temFilhos) return;
    setEscolhido(no.value);
    onSelect?.(no.value, no);
  };
  const desenhar = (nos: TreeNode[], nivel: number): React.ReactNode[] =>
    nos.flatMap((no) => {
      const temFilhos = !!no.children?.length;
      const aberto = abertos.includes(no.value);
      const ativo = !withCheckboxes && escolhido === no.value;
      const estado = withCheckboxes ? treeCheckState(no, marcados) : undefined;
      const cor = ativo ? c.accent : c.text;
      return [
        <ContentColor key={no.value} value={c.text2}>
          <UnstyledButton
            accessibilityRole={withCheckboxes ? "checkbox" : "button"}
            accessibilityLabel={no.label}
            accessibilityState={{
              disabled: !!no.disabled,
              ...(temFilhos ? { expanded: aberto } : {}),
              ...(estado ? { checked: estado === "all" ? true : estado === "some" ? "mixed" : false } : { selected: ativo }),
            }}
            disabled={no.disabled}
            onPress={() => tocar(no)}
            style={({ pressed }) => [
              { flexDirection: "row", alignItems: "center", gap: space[2], minHeight: touchTarget, paddingLeft: nivel * space[6], paddingRight: space[2], borderRadius: radius.xs },
              ativo && { backgroundColor: c.accentTint },
              pressed && { opacity: state.pressedOpacity },
              no.disabled && { opacity: state.disabledOpacity },
            ]}
          >
            <View style={{ width: space[6], alignItems: "center", transform: [{ rotate: aberto ? "90deg" : "0deg" }] }}>{temFilhos && <Icon name="chevron-right" size="sm" />}</View>
            {estado && <CaixaDeMarcar estado={estado} />}
            <RNText style={{ flex: 1, color: cor, fontSize: fontSize.md, fontFamily: nativeFontFamily[ativo ? 500 : 400] }}>{no.label}</RNText>
          </UnstyledButton>
        </ContentColor>,
        ...(temFilhos && aberto ? desenhar(no.children ?? [], nivel + 1) : []),
      ];
    });
  return <View style={style}>{desenhar(data, 0)}</View>;
}
