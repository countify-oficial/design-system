import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { semViolacoes } from "@countify-oficial/test-utils";
import { describe, expect, it, vi } from "vitest";
import { Dropzone } from "../src";

const arq = (name: string, type: string) => new File(["x"], name, { type });

describe("Dropzone", () => {
  it("escolher pelo clique: aceitos e recusados com motivo", async () => {
    const user = userEvent.setup({ applyAccept: false });
    const aoSoltar = vi.fn();
    const aoRecusar = vi.fn();
    const { container } = render(<Dropzone accept={["image/*"]} onDrop={aoSoltar} onReject={aoRecusar} />);
    const area = screen.getByRole("button", { name: "Arraste os arquivos ou clique para escolher" });
    await semViolacoes(container);
    const entrada = container.querySelector<HTMLInputElement>('input[type="file"]');
    if (!entrada) throw new Error("sem input");
    await user.upload(entrada, [arq("foto.png", "image/png"), arq("nota.pdf", "application/pdf")]);
    expect(aoSoltar).toHaveBeenCalledWith([expect.objectContaining({ name: "foto.png" })]);
    expect(aoRecusar.mock.calls[0]?.[0]).toEqual([expect.objectContaining({ reasons: ["file-invalid-type"] })]);
    expect(area.tabIndex).toBe(0);
  });

  it("arrastar mostra o estado; soltar entrega; desativado não recebe", () => {
    const aoSoltar = vi.fn();
    const { rerender } = render(
      <Dropzone accept={["image/*"]} onDrop={aoSoltar}>
        <Dropzone.Idle>Solte a foto</Dropzone.Idle>
        <Dropzone.Accept>Pode soltar</Dropzone.Accept>
        <Dropzone.Reject>Só imagens</Dropzone.Reject>
      </Dropzone>,
    );
    const area = screen.getByRole("button");
    fireEvent.dragOver(area, { dataTransfer: { items: [{ kind: "file", type: "application/pdf" }] } });
    expect(area.textContent).toBe("Só imagens");
    expect(area.hasAttribute("data-reject")).toBe(true);
    fireEvent.drop(area, { dataTransfer: { files: [arq("a.png", "image/png")], items: [] } });
    expect(aoSoltar).toHaveBeenCalledOnce();
    expect(area.textContent).toBe("Solte a foto");
    rerender(<Dropzone disabled onDrop={aoSoltar} />);
    fireEvent.drop(screen.getByRole("button"), { dataTransfer: { files: [arq("b.png", "image/png")], items: [] } });
    expect(aoSoltar).toHaveBeenCalledOnce();
  });
});
