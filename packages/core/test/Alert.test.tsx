import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Alert, Button, EmptyState, Notification } from "../src";
import { semViolacoes } from "./setup";

describe("Alert, Notification e EmptyState", () => {
  it("Alert de erro: role alert, ícone na cor de queda, título e texto", async () => {
    const { container } = render(<Alert color="down" title="Não foi possível carregar">Tente de novo em instantes.</Alert>);
    const a = screen.getByRole("alert");
    expect(a.style.getPropertyValue("--tone-c")).toBe("var(--cf-color-down)");
    expect(a.querySelector("svg")).not.toBeNull();
    expect(a.textContent).toContain("Não foi possível carregar");
    await semViolacoes(container);
  });

  it("Alert informativo é status; icon={null} tira o ícone; fechar chama onClose", () => {
    const aoFechar = vi.fn();
    render(<Alert icon={null} withCloseButton onClose={aoFechar}>Sem conexão · atualizado às 14:32</Alert>);
    const a = screen.getByRole("status");
    expect(a.querySelectorAll("svg")).toHaveLength(1); // só o do botão de fechar
    fireEvent.click(screen.getByRole("button", { name: "Fechar" }));
    expect(aoFechar).toHaveBeenCalled();
  });

  it("Notification: status, ação e erro como alert", async () => {
    const { container } = render(
      <>
        <Notification title="Análise salva" action={<Button variant="subtle" size="sm">Desfazer</Button>} />
        <Notification color="down" loading>Falha ao enviar</Notification>
      </>,
    );
    expect(screen.getByRole("status").textContent).toContain("Análise salva");
    expect(screen.getByRole("alert").dataset["color"]).toBe("down");
    await semViolacoes(container);
  });

  it("EmptyState: título, descrição e ação", async () => {
    const { container } = render(<EmptyState title="Nenhuma análise salva" description="Salve uma análise para ver aqui."><Button variant="dashed">+ Nova análise</Button></EmptyState>);
    expect(screen.getByText("Nenhuma análise salva").tagName).toBe("P");
    expect(screen.getByRole("button", { name: "+ Nova análise" })).toBeTruthy();
    await semViolacoes(container);
  });
});
