// Catálogo da documentação: categorias, descrição curta de cada página e a linha de importação.
// O índice (Componentes.stories.tsx) e a página de cada componente (.storybook/pagina.tsx) leem daqui.

/** As categorias de componentes, na ordem da barra lateral, com a frase do índice. */
export const categorias = [
  ["Primitivos", "A base dos outros componentes: caixa, texto, botão sem aparência e utilidades de acessibilidade."],
  ["Layout", "Organizam a tela: pilhas, linhas, grades, contêiner e a moldura do aplicativo."],
  ["Tipografia", "Títulos, links, listas, citações e trechos de código."],
  ["Botões", "Disparam ações: botão, ícone, alternância, cópia, envio de arquivo e barra de ações."],
  ["Campos", "Entrada de texto, números, senha, máscara, código e arquivo."],
  ["Escolhas", "Marcar, ligar, escolher entre opções, deslizar e avaliar."],
  ["Combobox", "Listas de escolha com busca, níveis e menções."],
  ["Dados", "Mostram informação: tabela, ficha, sanfona, imagem e números."],
  ["Feedback", "Estado e retorno: alertas, selos, progresso, carregamento e superfícies."],
  ["Navegação", "Andar entre telas e seções: abas, trilha, paginação, etapas e árvore."],
  ["Sobreposições", "Por cima da tela: janelas, gavetas, menus, dicas e camadas."],
  ["Extensões", "Pacotes à parte: datas, gráficos, avisos, janelas por função, carrossel e mais."],
] as const;

/** Uma linha por página, como no índice. */
export const descricoes: Record<string, string> = {
  "Primitivos/Box": "A caixa base, com o elemento HTML que você escolher.",
  "Primitivos/FocusTrap": "Prende o foco do teclado dentro de uma área.",
  "Primitivos/Portal": "Desenha o conteúdo fora da árvore, no fim da página.",
  "Primitivos/Text": "Texto com tamanho, peso e cor dos tokens.",
  "Primitivos/Transition": "Entrada e saída com os tempos da Countify.",
  "Primitivos/UnstyledButton": "Botão sem aparência, a base dos outros botões.",
  "Primitivos/VisuallyHidden": "Texto só para o leitor de tela.",
  "Layout/AppShell": "A moldura do aplicativo: topo, menu e conteúdo.",
  "Layout/AspectRatio": "Mantém a proporção de imagens e vídeos.",
  "Layout/Center": "Centraliza o conteúdo nos dois eixos.",
  "Layout/Container": "Limita a largura e dá a margem lateral.",
  "Layout/Flex": "Flexbox com as medidas dos tokens.",
  "Layout/Grid": "Grade de 12 colunas por ponto de quebra.",
  "Layout/Group": "Itens lado a lado, com espaço igual.",
  "Layout/PageHeader": "Cabeçalho de página com voltar, título e ações.",
  "Layout/ScrollArea": "Rolagem com a barra da Countify.",
  "Layout/SimpleGrid": "Colunas de mesma largura.",
  "Layout/Space": "Espaço vazio entre elementos.",
  "Layout/Splitter": "Painéis com divisória de arrastar.",
  "Layout/Stack": "Itens um embaixo do outro.",
  "Tipografia/Anchor": "Link no meio do texto.",
  "Tipografia/Blockquote": "Citação com destaque.",
  "Tipografia/Code, Mark e Highlight": "Código, marca-texto e destaque de busca.",
  "Tipografia/List": "Listas com marcador ou número.",
  "Tipografia/Title": "Títulos de página e de seção.",
  "Tipografia/Typography": "Estilo para texto vindo de HTML ou Markdown.",
  "Botões/Guia de uso": "Qual botão usar, padrões, texto do botão e teclado.",
  "Botões/Button": "A ação principal, a secundária, a destrutiva e a de adicionar.",
  "Botões/ActionIcon": "Botão só com ícone, com nome para o leitor de tela.",
  "Botões/CopyButton": "Copia um texto e avisa por um tempo que copiou.",
  "Botões/FileButton": "Abre a escolha de arquivo a partir de qualquer botão.",
  "Botões/Icon": "Ícones da Countify e todos os do Tabler, no mesmo traço.",
  "Botões/Loader": "Girador para esperas curtas dentro de um botão ou bloco.",
  "Botões/Toggle": "Botão que liga e desliga, com visual de chip.",
  "Botões/Toolbar": "Barra de botões que se navega pelas setas.",
  "Campos/Fieldset": "Agrupa campos relacionados sob um título.",
  "Campos/FileInput": "Campo que mostra o arquivo escolhido.",
  "Campos/MaskInput": "Texto com máscara: CPF, CNPJ, CEP, telefone.",
  "Campos/NativeSelect": "A lista de escolha nativa do sistema.",
  "Campos/NumberInput": "Números com passo, limites e formato brasileiro.",
  "Campos/PasswordInput": "Senha com o botão de mostrar e ocultar.",
  "Campos/PinInput": "Código com uma caixa por caractere.",
  "Campos/TextInput": "Campo de texto com rótulo, ajuda e erro.",
  "Campos/Textarea": "Texto de várias linhas, com altura automática.",
  "Escolhas/Checkbox": "Caixa de marcar, sozinha ou em grupo.",
  "Escolhas/Chip": "Escolha em formato de chip, única ou múltipla.",
  "Escolhas/ColorPicker": "Escolha de cor, com matiz e transparência.",
  "Escolhas/Radio": "Uma opção entre várias.",
  "Escolhas/Rating": "Avaliação em estrelas.",
  "Escolhas/SegmentedControl": "Uma opção entre poucas, lado a lado.",
  "Escolhas/Slider": "Um valor ou um intervalo, arrastando.",
  "Escolhas/Switch": "Liga e desliga uma configuração.",
  "Combobox/Cascader": "Escolha em níveis: estado, cidade, loja.",
  "Combobox/Mentions": "Texto com menções por @ e sugestões.",
  "Combobox/Select": "Lista de escolha com busca.",
  "Combobox/TreeSelect": "Escolha numa árvore de itens.",
  "Dados/Accordion": "Seções que abrem e fecham.",
  "Dados/DataList": "Pares de rótulo e valor, como uma ficha.",
  "Dados/Image": "Imagem com proporção, canto e substituta.",
  "Dados/Marquee": "Faixa que rola sozinha.",
  "Dados/NumberFormatter": "Números, moedas e porcentagens no formato brasileiro.",
  "Dados/OverflowList": "Mostra o que cabe e resume o resto em +N.",
  "Dados/Table": "Tabela para o computador, com cabeçalho e linhas.",
  "Feedback/Alert": "Mensagem de destaque no meio do conteúdo.",
  "Feedback/Avatar": "Foto ou iniciais de uma pessoa ou loja.",
  "Feedback/Badge": "Selo curto de estado ou contagem.",
  "Feedback/Divider": "Linha que separa conteúdos.",
  "Feedback/Indicator": "Ponto ou número no canto de outro elemento.",
  "Feedback/Kbd": "Tecla de atalho.",
  "Feedback/Paper e Card": "Superfícies de cartão para agrupar conteúdo.",
  "Feedback/Progress": "Barra de progresso, simples ou em partes.",
  "Feedback/Skeleton": "Bloco cinza no lugar do conteúdo enquanto carrega.",
  "Feedback/SkeletonMask": "Transforma uma tela inteira em blocos de carregamento.",
  "Feedback/ThemeIcon": "Ícone dentro de um quadrado colorido.",
  "Navegação/Breadcrumbs": "A trilha do caminho até a página.",
  "Navegação/Burger": "Botão de abrir e fechar o menu.",
  "Navegação/NavLink": "Item de menu lateral.",
  "Navegação/Pagination": "Páginas de uma lista longa.",
  "Navegação/Stepper": "Etapas de um processo.",
  "Navegação/TableOfContents": "Índice das seções da página.",
  "Navegação/Tabs": "Abas que trocam o conteúdo.",
  "Navegação/Tree": "Árvore de itens que abrem e fecham.",
  "Sobreposições/Computador": "Menu de barra, janela flutuante, tour e indicador.",
  "Sobreposições/Modal e Drawer": "Janela central e gaveta lateral.",
  "Sobreposições/Overlay": "Camada escura ou de carregamento por cima.",
  "Sobreposições/Popover, Menu e Tooltip": "Balões presos a um elemento: conteúdo, menu e dica.",
  "Extensões/Carousel, Dropzone, Spotlight e CodeHighlight": "Carrossel, área de soltar arquivos, busca rápida e bloco de código.",
  "Extensões/Charts": "Gráficos em SVG: linha, área, barras, pizza, radar e mais.",
  "Extensões/Dates": "Calendário, seletor de data e de período, data e hora.",
  "Extensões/Modals": "Janelas abertas por função, como a confirmação.",
  "Extensões/Notifications": "Avisos rápidos chamados de qualquer lugar.",
};

// páginas cujo título não é o nome do que se importa
const importacoes: Record<string, string> = {
  "Extensões/Carousel, Dropzone, Spotlight e CodeHighlight": [
    'import { Carousel } from "@countify-oficial/carousel";',
    'import { Dropzone } from "@countify-oficial/dropzone";',
    'import { Spotlight, spotlight } from "@countify-oficial/spotlight";',
    'import { CodeHighlight } from "@countify-oficial/code-highlight";',
  ].join("\n"),
  "Extensões/Charts": 'import { AreaChart, BarChart, LineChart, PieChart } from "@countify-oficial/charts";',
  "Extensões/Dates": 'import { Calendar, DateInput, DatePicker, DateTimePicker, TimeInput } from "@countify-oficial/dates";',
  "Extensões/Modals": 'import { ModalsProvider, modals } from "@countify-oficial/modals";',
  "Extensões/Notifications": 'import { Notifications, notifications } from "@countify-oficial/notifications";',
  "Sobreposições/Computador": 'import { FloatingIndicator, FloatingWindow, Menubar, Tour } from "@countify-oficial/core";',
};

/** A linha de importação da página; os nomes saem do título ("Paper e Card" → Paper, Card). */
export function importacao(titulo: string, componente?: string): string {
  if (importacoes[titulo]) return importacoes[titulo];
  const nomes = (titulo.split("/").pop() ?? "").split(/, | e /).filter((n) => /^[A-Z][A-Za-z]+$/.test(n));
  const lista = nomes.length ? nomes : componente ? [componente] : [];
  return lista.length ? `import { ${lista.join(", ")} } from "@countify-oficial/core";` : "";
}

/** O id que o Storybook dá a um título ("Botões/Guia de uso" → "botões-guia-de-uso"), como o sanitize dele. */
export const idDoTitulo = (titulo: string): string =>
  titulo
    .toLowerCase()
    .replace(/[ ’–—―′¿'`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Link para a página de docs, de dentro do iframe da documentação. */
export const linkDaPagina = (titulo: string): string => `./?path=/docs/${idDoTitulo(titulo)}--docs`;
