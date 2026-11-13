import { useControllableState } from "@countify-oficial/hooks";
import { useComponentProps, useCountifyTheme, useMessages } from "@countify-oficial/provider";
import { fontSize, nativeFontFamily, space } from "@countify-oficial/tokens";
import type { ReactNode } from "react";
import { Text as RNText, View } from "react-native";
import { Button } from "../Button/Button";
import { Drawer } from "../Drawer/Drawer";

export interface TourStep {
  title: string;
  description?: ReactNode;
}

export interface TourProps {
  steps: TourStep[];
  opened: boolean;
  onClose: () => void;
  step?: number | undefined;
  defaultStep?: number | undefined;
  onStepChange?: ((step: number) => void) | undefined;
}

/** Tour guiado. No celular, cada passo aparece numa folha que sobe, sem recorte: o que ele explica fica visível acima. */
export function Tour(props: TourProps) {
  const messages = useMessages();
  const { steps, opened, onClose, step, defaultStep, onStepChange } = useComponentProps("Tour", {}, props);
  const { colors: c } = useCountifyTheme();
  const [atual, setAtual] = useControllableState({ value: step, defaultValue: defaultStep ?? 0, onChange: onStepChange });
  const passo = steps[atual];
  if (!passo) return null;
  const ultimo = atual === steps.length - 1;
  return (
    <Drawer opened={opened} onClose={onClose} title={passo.title} position="bottom">
      {typeof passo.description === "string" ? <RNText style={{ color: c.text2, fontSize: fontSize.sm, fontFamily: nativeFontFamily[400] }}>{passo.description}</RNText> : passo.description}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: space[2] }}>
        <RNText style={{ color: c.text2, fontSize: fontSize.xs, fontFamily: nativeFontFamily[400] }}>{messages.stepOf(atual + 1, steps.length)}</RNText>
        <View style={{ flexDirection: "row", gap: space[2] }}>
          {atual > 0 && <Button variant="subtle" size="sm" onPress={() => setAtual(atual - 1)}>{messages.back}</Button>}
          <Button size="sm" onPress={() => (ultimo ? onClose() : setAtual(atual + 1))}>{ultimo ? messages.done : messages.next}</Button>
        </View>
      </View>
    </Drawer>
  );
}
