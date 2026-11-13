/** Textos que os componentes mostram ou dizem ao leitor de tela. Padrão em pt-BR; o app troca pelo provider. */
export interface CountifyMessages {
  close: string;
  loading: string;
  /** Spoiler fechado */
  showMore: string;
  /** Spoiler aberto */
  showLess: string;
  /** botão do PasswordInput */
  showPassword: string;
  hidePassword: string;
  /** botões do NumberInput */
  increment: string;
  decrement: string;
  /** botão de limpar (FileInput, Select…) */
  clear: string;
  /** erro do JsonInput */
  invalidJson: string;
  /** marca de campo obrigatório, para o leitor de tela */
  required: string;
  /** partes do ColorPicker, para o leitor de tela */
  saturation: string;
  hue: string;
  alpha: string;
  /** botões do Tour */
  next: string;
  back: string;
  done: string;
  /** "1 de 4" no Tour e no Stepper */
  stepOf: (atual: number, total: number) => string;
  /** busca dos campos de escolha */
  search: string;
  /** lista vazia da busca */
  nothingFound: string;
  /** botão de tirar uma etiqueta (Pill) */
  remove: (rotulo: string) => string;
}

export const defaultMessages: CountifyMessages = {
  close: "Fechar",
  loading: "Carregando",
  showMore: "Mostrar mais",
  showLess: "Mostrar menos",
  showPassword: "Mostrar senha",
  hidePassword: "Ocultar senha",
  increment: "Aumentar",
  decrement: "Diminuir",
  clear: "Limpar",
  invalidJson: "JSON inválido",
  required: "obrigatório",
  saturation: "Saturação e brilho",
  hue: "Matiz",
  alpha: "Transparência",
  next: "Próximo",
  back: "Voltar",
  done: "Concluir",
  stepOf: (atual, total) => `${atual} de ${total}`,
  search: "Buscar",
  nothingFound: "Nada encontrado",
  remove: (rotulo) => `Remover ${rotulo}`,
};
