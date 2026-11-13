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
};
