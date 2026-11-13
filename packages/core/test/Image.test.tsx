import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BackgroundImage, ColorSwatch, Image } from "../src";
import { semViolacoes } from "./setup";

describe("Image, BackgroundImage e ColorSwatch", () => {
  it("Image: canto e reserva quando não carrega", async () => {
    const { container } = render(<Image src="loja.jpg" alt="Fachada" radius="md" fallbackSrc="vazio.svg" />);
    const img = screen.getByRole("img", { name: "Fachada" });
    expect(img.style.getPropertyValue("--image-radius")).toBe("var(--cf-radius-md)");
    fireEvent.error(img);
    expect(img.getAttribute("src")).toBe("vazio.svg");
    await semViolacoes(container);
  });

  it("BackgroundImage põe a imagem como fundo, com aspas escapadas", () => {
    render(<BackgroundImage data-testid="b" src={'foto "1".jpg'} radius="sm">Texto</BackgroundImage>);
    expect(screen.getByTestId("b").style.getPropertyValue("--bg-image")).toBe('url("foto \\"1\\".jpg")');
  });

  it("ColorSwatch mostra a cor do dado", () => {
    render(<ColorSwatch data-testid="c" color="rgb(10 20 30)" aria-label="Azul da categoria" />);
    expect(screen.getByTestId("c").style.getPropertyValue("--swatch-color")).toBe("rgb(10 20 30)");
    expect(screen.getByTestId("c").hasAttribute("data-with-shadow")).toBe(true);
  });
});
