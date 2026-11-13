import { Text, Transition, UnstyledButton, type TransitionDuration, type TransitionName } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

const meta = {
  title: "Primitivos/Transition",
  component: Transition,
  args: { mounted: true, children: () => null, onEntered: fn(), onExited: fn() },
} satisfies Meta<typeof Transition>;
export default meta;
type Story = StoryObj<typeof meta>;

const nomes: TransitionName[] = ["fade", "scale", "slide-up", "slide-down"];
const duracoes: TransitionDuration[] = ["fast", "base", "slow"];
const cartao = { padding: "var(--cf-space-4)", borderRadius: "var(--cf-radius-md)", background: "var(--cf-color-card)", boxShadow: "var(--cf-shadow-lg)" };

function Exemplo({ transition, duration }: { transition: TransitionName; duration: TransitionDuration }) {
  const [aberto, setAberto] = useState(true);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--cf-space-4)", minHeight: "var(--cf-list-row-height)" }}>
      <UnstyledButton onClick={() => setAberto((a) => !a)} style={{ width: "var(--cf-side-panel-width)" }}>
        <Text component="span" color="accent">{aberto ? "Esconder" : "Mostrar"} {transition} · {duration}</Text>
      </UnstyledButton>
      <Transition mounted={aberto} transition={transition} duration={duration}>
        {(style) => <div style={{ ...cartao, ...style }}><Text component="span">Cartão</Text></div>}
      </Transition>
    </div>
  );
}

export const Todas: Story = {
  name: "Todas as animações e durações",
  render: () => <>{nomes.flatMap((t) => duracoes.map((d) => <Exemplo key={t + d} transition={t} duration={d} />))}</>,
};
