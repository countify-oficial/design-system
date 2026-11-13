/** Cor em HSV com transparência: h de 0 a 360, s e v de 0 a 100, a de 0 a 1 (a forma do ColorPicker). */
export interface HSVA {
  h: number;
  s: number;
  v: number;
  a: number;
}

export type ColorFormat = "hex" | "hexa" | "rgb" | "rgba" | "hsl" | "hsla";

const limitar = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const arredondar = (n: number, casas = 0) => Math.round(n * 10 ** casas) / 10 ** casas;

export function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  const [R, G, B] = [r / 255, g / 255, b / 255];
  const max = Math.max(R, G, B);
  const d = max - Math.min(R, G, B);
  let h = 0;
  if (d !== 0) h = max === R ? ((G - B) / d) % 6 : max === G ? (B - R) / d + 2 : (R - G) / d + 4;
  return { h: (h * 60 + 360) % 360, s: max === 0 ? 0 : (d / max) * 100, v: max * 100 };
}

export function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
  const S = s / 100;
  const V = v / 100;
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return Math.round((V - V * S * Math.max(0, Math.min(k, 4 - k, 1))) * 255);
  };
  return { r: f(5), g: f(3), b: f(1) };
}

function hslToHsv(h: number, s: number, l: number): { h: number; s: number; v: number } {
  const S = s / 100;
  const L = l / 100;
  const v = L + S * Math.min(L, 1 - L);
  return { h, s: v === 0 ? 0 : 2 * (1 - L / v) * 100, v: v * 100 };
}

function hsvToHsl(h: number, s: number, v: number): { h: number; s: number; l: number } {
  const S = s / 100;
  const V = v / 100;
  const l = V * (1 - S / 2);
  return { h, s: l === 0 || l === 1 ? 0 : ((V - l) / Math.min(l, 1 - l)) * 100, l: l * 100 };
}

/** Lê #rgb, #rrggbb, #rrggbbaa, rgb(a) e hsl(a). Texto que não é cor → undefined. */
export function parseColor(texto: string): HSVA | undefined {
  const t = texto.trim().toLowerCase();
  const hex = /^#([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/.exec(t)?.[1];
  if (hex) {
    const cheio = hex.length <= 4 ? Array.from(hex).map((c) => c + c).join("") : hex;
    const [r, g, b, a] = [0, 2, 4, 6].map((i) => parseInt(cheio.slice(i, i + 2) || "ff", 16));
    return { ...rgbToHsv(r ?? 0, g ?? 0, b ?? 0), a: (a ?? 255) / 255 };
  }
  const numeros = /^(rgba?|hsla?)\(([^)]*)\)$/.exec(t);
  if (!numeros) return undefined;
  const partes = (numeros[2] ?? "").split(/[\s,/]+/).filter(Boolean).map((p) => (p.endsWith("%") ? Number(p.slice(0, -1)) : Number(p)));
  if (partes.length < 3 || partes.some((n) => Number.isNaN(n))) return undefined;
  const [x = 0, y = 0, z = 0, a = 1] = partes;
  const alfa = limitar(numeros[2]?.split(/[\s,/]+/).filter(Boolean)[3]?.endsWith("%") ? a / 100 : a, 0, 1);
  if (numeros[1]?.startsWith("rgb")) return { ...rgbToHsv(limitar(x, 0, 255), limitar(y, 0, 255), limitar(z, 0, 255)), a: alfa };
  return { ...hslToHsv(((x % 360) + 360) % 360, limitar(y, 0, 100), limitar(z, 0, 100)), a: alfa };
}

/** Escreve a cor no formato pedido. */
export function formatColor({ h, s, v, a }: HSVA, format: ColorFormat = "hex"): string {
  const { r, g, b } = hsvToRgb(h, s, v);
  const dois = (n: number) => n.toString(16).padStart(2, "0");
  if (format === "hex") return `#${dois(r)}${dois(g)}${dois(b)}`;
  if (format === "hexa") return `#${dois(r)}${dois(g)}${dois(b)}${dois(Math.round(a * 255))}`;
  if (format === "rgb") return `rgb(${r}, ${g}, ${b})`;
  if (format === "rgba") return `rgba(${r}, ${g}, ${b}, ${arredondar(a, 2)})`;
  const hsl = hsvToHsl(h, s, v);
  const base = `${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%`;
  return format === "hsl" ? `hsl(${base})` : `hsla(${base}, ${arredondar(a, 2)})`;
}
