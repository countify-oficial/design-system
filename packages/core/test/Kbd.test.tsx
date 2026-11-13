import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Kbd } from "../src";

describe("Kbd", () => {
  it("é um <kbd>", () => {
    render(<p><Kbd>Ctrl</Kbd> + <Kbd>K</Kbd></p>);
    expect(screen.getByText("Ctrl").tagName).toBe("KBD");
  });
});
