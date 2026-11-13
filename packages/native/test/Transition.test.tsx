import { act, render, screen } from "@testing-library/react-native";
import { AccessibilityInfo, Text } from "react-native";
import { Transition, type TransitionProps } from "../src";

const Caixa = (props: Omit<TransitionProps, "children">) => (
  <Transition {...props}><Text>conteúdo</Text></Transition>
);
const conteudo = () => screen.queryByText("conteúdo");

beforeEach(() => jest.useFakeTimers());
afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe("Transition (React Native)", () => {
  it("escondido não monta; ao mostrar, monta e avisa ao terminar", async () => {
    const aoEntrar = jest.fn();
    const tela = await render(<Caixa mounted={false} transition="slide-up" onEntered={aoEntrar} />);
    expect(conteudo()).toBeNull();
    await tela.rerender(<Caixa mounted transition="slide-up" onEntered={aoEntrar} />);
    expect(conteudo()).toBeOnTheScreen();
    await act(() => jest.advanceTimersByTime(200));
    expect(aoEntrar).toHaveBeenCalledTimes(1);
  });

  it("ao esconder, anima e só então desmonta, e avisa", async () => {
    const aoSair = jest.fn();
    const tela = await render(<Caixa mounted onExited={aoSair} />);
    await tela.rerender(<Caixa mounted={false} onExited={aoSair} />);
    expect(conteudo()).toBeOnTheScreen();
    await act(() => jest.advanceTimersByTime(200));
    expect(conteudo()).toBeNull();
    expect(aoSair).toHaveBeenCalledTimes(1);
  });

  it("keepMounted deixa montado com display: none", async () => {
    await render(<Caixa mounted={false} keepMounted />);
    expect(conteudo()).toBeNull(); // display: none fica fora das buscas normais
    expect(screen.getByText("conteúdo", { includeHiddenElements: true })).toBeTruthy();
  });

  it("com reduzir movimento, termina sem esperar a duração", async () => {
    jest.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockResolvedValue(true);
    const aoSair = jest.fn();
    const tela = await render(<Caixa mounted duration="slow" onExited={aoSair} />);
    await tela.rerender(<Caixa mounted={false} duration="slow" onExited={aoSair} />);
    await act(() => jest.advanceTimersByTime(20));
    expect(aoSair).toHaveBeenCalledTimes(1);
  });
});
