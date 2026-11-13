import { describe, expect, it } from "vitest";
import { formatBytes, matchesAccept, splitFiles } from "../src/accept";

const arq = (name: string, type: string, size = 10) => new File([new Uint8Array(size)], name, { type });

describe("aceitar arquivos", () => {
  it("tipo por MIME, curinga e extensão", () => {
    expect(matchesAccept(arq("a.png", "image/png"), ["image/*"])).toBe(true);
    expect(matchesAccept(arq("a.CSV", "text/csv"), [".csv"])).toBe(true);
    expect(matchesAccept(arq("a.pdf", "application/pdf"), ["image/*", ".csv"])).toBe(false);
  });

  it("separa com o motivo; o limite conta só os aceitos", () => {
    const { accepted, rejected } = splitFiles([arq("a.png", "image/png"), arq("b.pdf", "application/pdf"), arq("c.png", "image/png", 5000), arq("d.png", "image/png")], {
      accept: ["image/*"], maxSize: 1000, maxFiles: 1,
    });
    expect(accepted.map((f) => f.name)).toEqual(["a.png"]);
    expect(rejected.map((r) => [r.file.name, r.reasons])).toEqual([["b.pdf", ["file-invalid-type"]], ["c.png", ["file-too-large"]], ["d.png", ["too-many-files"]]]);
  });

  it("tamanho legível", () => {
    expect(formatBytes(2.5 * 1024 * 1024)).toBe("2,5 MB");
  });
});
