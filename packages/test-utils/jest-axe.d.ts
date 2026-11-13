// Só o que os testes usam do jest-axe (o @types/jest-axe puxa o axe-core 3 e os globais do Jest).
declare module "jest-axe" {
  type Resultado = Promise<{ violations: { id: string; help: string }[] }>;
  export function axe(html: Element | string): Resultado;
  export function configureAxe(opcoes: { globalOptions?: { rules?: { id: string; selector?: string }[] }; rules?: Record<string, { enabled: boolean }> }): (html: Element | string) => Resultado;
}
