// Quais arquivos entram: tipo (MIME ou extensão), tamanho e quantidade, com o motivo de cada recusa.

export type RejectReason = "file-invalid-type" | "file-too-large" | "too-many-files";

export interface FileRejection {
  file: File;
  reasons: RejectReason[];
}

export interface AcceptOptions {
  /** Tipos aceitos: "image/*", "application/pdf", ".csv"… Vazio aceita tudo. */
  accept?: string[] | undefined;
  /** Tamanho máximo de cada arquivo, em bytes. */
  maxSize?: number | undefined;
  /** Quantos arquivos de uma vez. Padrão: sem limite (1 com multiple=false). */
  maxFiles?: number | undefined;
  multiple?: boolean | undefined;
}

/** O arquivo bate com um dos tipos ("image/*", "image/png", ".csv"). */
export function matchesAccept(file: Pick<File, "name" | "type">, accept: string[] | undefined): boolean {
  if (!accept || accept.length === 0) return true;
  const nome = file.name.toLowerCase();
  const tipo = file.type.toLowerCase();
  return accept.some((a) => {
    const t = a.trim().toLowerCase();
    if (t.startsWith(".")) return nome.endsWith(t);
    if (t.endsWith("/*")) return tipo.startsWith(t.slice(0, -1));
    return tipo === t;
  });
}

/** Separa os aceitos dos recusados (com os motivos). */
export function splitFiles(files: File[], { accept, maxSize, maxFiles, multiple = true }: AcceptOptions): { accepted: File[]; rejected: FileRejection[] } {
  const limite = multiple ? (maxFiles ?? Infinity) : 1;
  const accepted: File[] = [];
  const rejected: FileRejection[] = [];
  for (const file of files) {
    const reasons: RejectReason[] = [];
    if (!matchesAccept(file, accept)) reasons.push("file-invalid-type");
    if (maxSize !== undefined && file.size > maxSize) reasons.push("file-too-large");
    if (reasons.length === 0 && accepted.length >= limite) reasons.push("too-many-files");
    if (reasons.length) rejected.push({ file, reasons });
    else accepted.push(file);
  }
  return { accepted, rejected };
}

/** "2,5 MB". */
export const formatBytes = (bytes: number, locale = "pt-BR"): string => {
  const unidades = ["B", "KB", "MB", "GB"];
  let v = bytes;
  let i = 0;
  while (v >= 1024 && i < unidades.length - 1) {
    v /= 1024;
    i += 1;
  }
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(v)} ${unidades[i] ?? "B"}`;
};
