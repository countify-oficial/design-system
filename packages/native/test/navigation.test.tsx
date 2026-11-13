import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { Burger, NavLink, Pagination, Stepper, Tabs } from "../src";

describe("navegação (React Native)", () => {
  it("Tabs: tocar abre a aba e o painel dela", async () => {
    const aoMudar = jest.fn();
    await render(
      <Tabs defaultValue="dia" onChange={aoMudar}>
        <Tabs.List accessibilityLabel="Período">
          <Tabs.Tab value="dia">Dia</Tabs.Tab>
          <Tabs.Tab value="semana">Semana</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="dia"><Text>Hoje</Text></Tabs.Panel>
        <Tabs.Panel value="semana"><Text>Esta semana</Text></Tabs.Panel>
      </Tabs>,
    );
    expect(screen.getByRole("tab", { name: "Dia" })).toBeSelected();
    await fireEvent.press(screen.getByRole("tab", { name: "Semana" }));
    expect(aoMudar).toHaveBeenLastCalledWith("semana");
    expect(screen.getByText("Esta semana")).toBeOnTheScreen();
    expect(screen.queryByText("Hoje")).toBeNull();
  });

  it("Burger: nome e estado mudam ao abrir", async () => {
    const { rerender } = await render(<Burger opened={false} />);
    expect(screen.getByRole("button", { name: "Abrir menu" })).toBeCollapsed();
    await rerender(<Burger opened />);
    expect(screen.getByRole("button", { name: "Fechar menu" })).toBeExpanded();
  });

  it("Pagination: números, saltos e setas", async () => {
    const aoMudar = jest.fn();
    await render(<Pagination total={10} defaultValue={5} onChange={aoMudar} />);
    expect(screen.getByRole("button", { name: "Página 5" })).toBeSelected();
    expect(screen.getAllByText("…")).toHaveLength(2);
    await fireEvent.press(screen.getByRole("button", { name: "Página anterior" }));
    expect(aoMudar).toHaveBeenLastCalledWith(4);
    await fireEvent.press(screen.getByRole("button", { name: "Página 1" }));
    expect(screen.getByRole("button", { name: "Página anterior" })).toBeDisabled();
  });

  it("Stepper: passo atual, conteúdo e voltar pela barra", async () => {
    const ir = jest.fn();
    await render(
      <Stepper active={1} onStepClick={ir}>
        <Stepper.Step label="Lojas">Escolha as lojas</Stepper.Step>
        <Stepper.Step label="Câmeras">Ligue as câmeras</Stepper.Step>
        <Stepper.Step label="Pronto">Revise</Stepper.Step>
      </Stepper>,
    );
    expect(screen.getByText("Ligue as câmeras")).toBeOnTheScreen();
    expect(screen.getByText(/2 de 3/)).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Pronto" })).toBeDisabled();
    await fireEvent.press(screen.getByRole("button", { name: "Lojas" }));
    expect(ir).toHaveBeenCalledWith(0);
  });

  it("NavLink: a atual escolhida; com filhos abre", async () => {
    const tocou = jest.fn();
    await render(
      <>
        <NavLink label="Conta" description="Nome, e-mail e senha" active onPress={tocou} />
        <NavLink label="Lojas">
          <NavLink label="Lume Jardins" />
        </NavLink>
      </>,
    );
    const conta = screen.getByRole("link", { name: "Conta" });
    expect(conta).toBeSelected();
    await fireEvent.press(conta);
    expect(tocou).toHaveBeenCalled();
    const lojas = screen.getByRole("button", { name: "Lojas" });
    expect(lojas).toBeCollapsed();
    await fireEvent.press(lojas);
    expect(lojas).toBeExpanded();
  });
});
