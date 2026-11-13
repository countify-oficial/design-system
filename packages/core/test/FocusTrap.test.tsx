import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { describe, expect, it } from "vitest";
import { FocusTrap } from "../src";

function Janela({ autofocus = false }: { autofocus?: boolean }) {
  const [aberta, setAberta] = useState(false);
  return (
    <>
      <button onClick={() => setAberta(true)}>Abrir</button>
      {aberta && (
        <FocusTrap>
          <div role="dialog" aria-label="Janela">
            <button>Primeiro</button>
            <input aria-label="Nome" data-autofocus={autofocus || undefined} />
            <button onClick={() => setAberta(false)}>Fechar</button>
          </div>
        </FocusTrap>
      )}
    </>
  );
}

describe("FocusTrap", () => {
  it("foca o primeiro, prende o Tab nas duas direções e devolve o foco ao sair", async () => {
    const user = userEvent.setup();
    render(<Janela />);
    await user.click(screen.getByText("Abrir"));
    expect(document.activeElement).toBe(screen.getByText("Primeiro"));
    await user.tab();
    await user.tab();
    expect(document.activeElement).toBe(screen.getByText("Fechar"));
    await user.tab();
    expect(document.activeElement).toBe(screen.getByText("Primeiro"));
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(screen.getByText("Fechar"));
    await user.click(screen.getByText("Fechar"));
    expect(document.activeElement).toBe(screen.getByText("Abrir"));
  });

  it("data-autofocus tem preferência", async () => {
    const user = userEvent.setup();
    render(<Janela autofocus />);
    await user.click(screen.getByText("Abrir"));
    expect(document.activeElement).toBe(screen.getByLabelText("Nome"));
  });

  it("sem nada focável, foca o próprio filho; o ref do filho continua valendo", () => {
    const ref = createRef<HTMLDivElement>();
    render(<FocusTrap><div ref={ref} data-testid="vazio">só texto</div></FocusTrap>);
    expect(ref.current).toBe(screen.getByTestId("vazio"));
    expect(document.activeElement).toBe(ref.current);
    expect(ref.current?.tabIndex).toBe(-1);
  });

  it("inativo não mexe no foco", () => {
    render(<FocusTrap active={false}><div><button>Dentro</button></div></FocusTrap>);
    expect(document.activeElement).toBe(document.body);
  });
});
