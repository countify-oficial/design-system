import { FocusTrap, Text, UnstyledButton } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta = {
  title: "Primitivos/FocusTrap",
  component: FocusTrap,
  parameters: { docs: { description: { component: "Abra e use Tab e Shift+Tab: o foco não sai da janela. Ao fechar, volta ao botão." } } },
} satisfies Meta<typeof FocusTrap>;
export default meta;

const janela = { display: "flex", flexDirection: "column", gap: "var(--cf-space-3)", padding: "var(--cf-space-4)", marginTop: "var(--cf-space-4)", borderRadius: "var(--cf-radius-md)", background: "var(--cf-color-card)", boxShadow: "var(--cf-shadow-lg)" } as const;

function Janela({ autofocus }: { autofocus?: boolean }) {
  const [aberta, setAberta] = useState(false);
  return (
    <>
      <UnstyledButton onClick={() => setAberta(true)}><Text component="span" color="accent">Abrir janela</Text></UnstyledButton>
      {aberta && (
        <FocusTrap>
          <div role="dialog" aria-label="Nova loja" style={janela}>
            <Text component="label" htmlFor="loja-nome" color="label">Nome da loja</Text>
            <input id="loja-nome" data-autofocus={autofocus || undefined} />
            <Text component="label" htmlFor="loja-cidade" color="label">Cidade</Text>
            <input id="loja-cidade" />
            <UnstyledButton onClick={() => setAberta(false)}><Text component="span" color="accent">Fechar</Text></UnstyledButton>
          </div>
        </FocusTrap>
      )}
    </>
  );
}

export const Padrao: StoryObj = { name: "Padrão (foca o primeiro)", render: () => <Janela /> };
export const ComAutofocus: StoryObj = { name: "Com data-autofocus", render: () => <Janela autofocus /> };
