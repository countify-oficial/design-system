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
  /** Começo do nome do "?" de ajuda ("Ajuda: Fluxo de pessoas"). */
  help: string;
  done: string;
  /** "1 de 4" no Tour e no Stepper */
  stepOf: (atual: number, total: number) => string;
  /** busca dos campos de escolha */
  search: string;
  /** lista vazia da busca */
  nothingFound: string;
  /** botão de tirar uma etiqueta (Pill) */
  remove: (rotulo: string) => string;
  /** Pagination: nome da navegação, setas e cada página */
  pagination: string;
  previousPage: string;
  nextPage: string;
  firstPage: string;
  lastPage: string;
  page: (n: number) => string;
  /** nome da navegação dos Breadcrumbs */
  breadcrumbs: string;
  /** Burger fechado e aberto */
  openMenu: string;
  closeMenu: string;
  /** nome do TableOfContents */
  tableOfContents: string;
  /** setas do Scroller */
  scrollBackward: string;
  scrollForward: string;
  /** nome do menu do AppShell (cabeçalho e abas embaixo) */
  sections: string;
  /** alça do Splitter */
  resizePanels: string;
  /** botões da confirmação (modals.openConfirmModal) */
  confirm: string;
  cancel: string;
  /** calendário e campos de data */
  previousMonth: string;
  nextMonth: string;
  today: string;
  apply: string;
  shortcuts: string;
  time: string;
  chooseDate: string;
  /** gráficos: a hora atual, a legenda do mapa de calor e a tabela de dados escondida */
  now: string;
  less: string;
  more: string;
  closed: string;
  /** nomes padrão das séries da linha */
  actual: string;
  forecast: string;
  normalRange: string;
  /** gráficos: o nome do controle que percorre os pontos (setas) e mostra a dica */
  chartPoint: string;
  /** link de copiar do CodeHighlight */
  copy: string;
  copied: string;
  /** texto padrão do Dropzone */
  dropFiles: string;
  /** Carousel: o tipo da região e de cada item, para o leitor de tela */
  carousel: string;
  slide: string;
  /** variação do StatCard e do Meter, para o leitor de tela ("alta de 12%", "queda de 3%", "sem variação") */
  increase: (valor: string) => string;
  decrease: (valor: string) => string;
  noChange: string;
  /** DataTable: caixa de cada linha ("Selecionar Lume Jardins"), a do cabeçalho, a contagem e o nome da barra de ações */
  selectRow: (rotulo: string) => string;
  selectPageRows: string;
  selectedCount: (n: number) => string;
  selectionActions: string;
  /** DataTable sem linhas */
  emptyTable: string;
  /** NotificationList: grupo de ontem (o de hoje é `today`), aviso não lido e lista vazia */
  yesterday: string;
  unread: string;
  noNotifications: string;
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
  help: "Ajuda",
  done: "Concluir",
  stepOf: (atual, total) => `${atual} de ${total}`,
  search: "Buscar",
  nothingFound: "Nada encontrado",
  remove: (rotulo) => `Remover ${rotulo}`,
  pagination: "Páginas",
  previousPage: "Página anterior",
  nextPage: "Próxima página",
  firstPage: "Primeira página",
  lastPage: "Última página",
  page: (n) => `Página ${n}`,
  breadcrumbs: "Caminho",
  openMenu: "Abrir menu",
  closeMenu: "Fechar menu",
  tableOfContents: "Nesta página",
  scrollBackward: "Rolar para trás",
  scrollForward: "Rolar para a frente",
  sections: "Seções",
  resizePanels: "Redimensionar painéis",
  confirm: "Confirmar",
  cancel: "Cancelar",
  previousMonth: "Mês anterior",
  nextMonth: "Próximo mês",
  today: "hoje",
  apply: "Aplicar",
  shortcuts: "Atalhos",
  time: "Horário",
  chooseDate: "Escolher data",
  now: "agora",
  less: "menos",
  more: "mais",
  closed: "fechado",
  actual: "Real",
  forecast: "Previsto",
  normalRange: "Faixa normal",
  chartPoint: "Ponto do gráfico",
  copy: "Copiar",
  copied: "Copiado",
  dropFiles: "Arraste os arquivos ou clique para escolher",
  carousel: "carrossel",
  slide: "item",
  increase: (valor) => `alta de ${valor}`,
  decrease: (valor) => `queda de ${valor}`,
  noChange: "sem variação",
  selectRow: (rotulo) => `Selecionar ${rotulo}`,
  selectPageRows: "Selecionar todas desta página",
  selectedCount: (n) => (n === 1 ? "1 selecionada" : `${n} selecionadas`),
  selectionActions: "Ações das linhas selecionadas",
  emptyTable: "Nada para mostrar",
  yesterday: "ontem",
  unread: "não lido",
  noNotifications: "Nenhum aviso",
};
