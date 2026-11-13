// Só o que os testes usam do jest-axe (o @types/jest-axe puxa o axe-core 3 e os globais do Jest).
declare module "jest-axe" {
  export function axe(html: Element | string): Promise<{ violations: { id: string; help: string }[] }>;
}
