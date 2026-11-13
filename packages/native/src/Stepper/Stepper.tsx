import { useComponentProps, useCountifyTheme, useMessages } from "@countify-oficial/provider";
import { fontSize, nativeFontFamily, radius, space, touchTarget } from "@countify-oficial/tokens";
import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";

export interface StepperStepProps {
  label: string;
  description?: ReactNode;
  allowStepSelect?: boolean | undefined;
  children?: ReactNode;
}

/** Um passo; o Stepper desenha a barra e mostra o conteúdo do atual. */
export function StepperStep(_props: StepperStepProps): null {
  return null;
}

/** O que aparece depois do último passo. */
export function StepperCompleted(_props: { children?: ReactNode }): null {
  return null;
}

export interface StepperProps {
  active: number;
  onStepClick?: ((index: number) => void) | undefined;
  allowNextStepsSelect?: boolean | undefined;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Passos de um fluxo: uma barra de 4 por passo, cheia até o atual, e "2 de 4 · Nome" embaixo. */
export function StepperRoot(props: StepperProps) {
  const messages = useMessages();
  const { colors: c } = useCountifyTheme();
  const { active, onStepClick, allowNextStepsSelect = false, children, style } = useComponentProps("Stepper", {}, props);
  const filhos = Children.toArray(children).filter(isValidElement);
  const passos = filhos.filter((f): f is ReactElement<StepperStepProps> => f.type === StepperStep).map((f) => f.props);
  const fim = filhos.find((f): f is ReactElement<{ children?: ReactNode }> => f.type === StepperCompleted);
  const atual = passos[active];
  const conteudo = atual ? atual.children : fim?.props.children;
  const letra = { fontSize: fontSize.sm, fontFamily: nativeFontFamily[400], color: c.text2 };
  return (
    <View style={[{ gap: space[2] }, style]}>
      <View style={{ flexDirection: "row", gap: space[1] }} accessibilityElementsHidden={!onStepClick} importantForAccessibility={onStepClick ? "auto" : "no-hide-descendants"}>
        {passos.map((p, i) => {
          const barra = <View style={{ height: space[1], borderRadius: radius.xs, backgroundColor: i <= active ? c.accent : c.borderStrong }} />;
          const pode = i !== active && (p.allowStepSelect ?? (i < active || allowNextStepsSelect));
          return onStepClick ? (
            <UnstyledButton
              key={p.label}
              accessibilityRole="button"
              accessibilityLabel={p.label}
              accessibilityState={{ selected: i === active, disabled: !pode }}
              disabled={!pode}
              onPress={() => onStepClick(i)}
              style={{ flex: 1, minHeight: touchTarget, justifyContent: "center" }}
            >
              {barra}
            </UnstyledButton>
          ) : (
            <View key={p.label} style={{ flex: 1 }}>{barra}</View>
          );
        })}
      </View>
      {atual && (
        <RNText style={letra}>
          {messages.stepOf(active + 1, passos.length)} · <RNText style={{ color: c.text, fontFamily: nativeFontFamily[500] }}>{atual.label}</RNText>
        </RNText>
      )}
      {atual?.description !== undefined && (typeof atual.description === "string" ? <RNText style={letra}>{atual.description}</RNText> : atual.description)}
      {conteudo !== undefined && <View style={{ paddingTop: space[2] }}>{typeof conteudo === "string" ? <RNText style={{ color: c.text, fontSize: fontSize.md, fontFamily: nativeFontFamily[400] }}>{conteudo}</RNText> : conteudo}</View>}
    </View>
  );
}

/** Stepper com Stepper.Step (um por passo) e Stepper.Completed. */
export const Stepper = Object.assign(StepperRoot, { Step: StepperStep, Completed: StepperCompleted });
