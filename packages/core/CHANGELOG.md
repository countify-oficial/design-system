# @countify-oficial/core

## 0.7.0

### Minor Changes

- 1aa5f0e: Announcement (web e celular): a novidade que fica na tela até a pessoa dispensar ("Nova versão do agente", "Agora dá para exportar em CSV"), para o rodapé do menu lateral ou o topo de uma tela. Cartão com o ícone no quadrado do tom (ThemeIcon), título, texto curto, uma ação opcional (Button ou Anchor) e o × "Dispensar". Funciona controlado (`opened`, `onDismiss`) ou não (`defaultOpened`); na web, `storageKey` lembra a dispensa no `localStorage`, e o foco vai para o próximo elemento focável ao dispensar. No provider, a mensagem `dismiss`.
- da0fa21: Button: variante `link` (aparência do Anchor, com a altura e o alvo de toque do botão) e `Button.Group` (botões encostados, horizontal ou vertical, com `role="group"` e nome obrigatório).
- 43178a7: SearchInput (web e celular): o campo de busca do mockup ("Busca no topo da lista"), com a lupa à esquerda, o × para limpar quando há texto e `onSearch` com `debounce` opcional. Na web, `type="search"` com `role="searchbox"`, Esc limpa e `shortcut` ("/" ou "mod+K") leva o foco ao campo, mostrado num Kbd enquanto vazio; no celular, sem atalho nem Esc. Mensagem nova no provider: `clearSearch` ("Limpar busca").

### Patch Changes

- Updated dependencies [1aa5f0e]
- Updated dependencies [e17705b]
- Updated dependencies [e38b598]
- Updated dependencies [43178a7]
  - @countify-oficial/provider@0.5.0

## 0.6.0

### Minor Changes

- 76c73f4: DataTable: tabela pronta com colunas declarativas, ordenação (pt-BR e números de verdade), seleção com a barra de ações, paginação no cliente ou no servidor (`manual`), carregando e vazio. Só no computador (no celular, lista). Mensagens novas no provider: `selectRow`, `selectPageRows`, `selectedCount`, `selectionActions` e `emptyTable`.
- d4cc0d0: DataGrid: grade de edição em massa, como uma planilha (só computador). Colunas de texto, número e moeda com formato pt-BR e validação; navegação por teclado (padrão ARIA grid, roving tabindex), edição na célula com Enter, F2 ou digitando; desfazer e refazer; copiar e colar blocos do Excel; só as linhas visíveis desenhadas (10.000 linhas). Mensagens novas no provider: `invalidNumber`, `cellsCopied`, `cellsPasted`, `cellsRejected`, `undone` e `redone`.
- 0dc2592: Menu de contexto: `<Menu trigger="context">` abre o mesmo Menu no ponto do clique direito dentro do `Menu.Target` (a área-alvo), ou no elemento focado com Shift+F10 e a tecla Menu, sem o menu do navegador. No celular, abre a mesma folha do Menu no toque longo.
- 12511a7: NotificationList (web e celular): a lista dos Avisos (mockups W-Avisos e M-Avisos), agrupada por dia ("hoje", "ontem", "12 de novembro"), cada aviso com ícone ou iniciais, título, loja e a hora em `<time>`; o escolhido fica em destaque (`selected`, `onSelect`), o não lido em negrito com um ponto, e há os estados vazio (EmptyState) e carregando (SkeletonLoader). Na web, uma parada no Tab e as setas andam entre os avisos. O NavLink do celular aceita `accessibilityLabel`. No provider, `groupByDay` e as mensagens `yesterday`, `unread` e `noNotifications`.
- 3a43a5b: StatCard (cartão de indicador: rótulo com o "?", número com prefixo e unidade, linha de apoio, variação com seta e lugar para um gráfico pequeno) e Meter (medidor de meta: rótulo e valor em destaque, a barra `role="meter"` com o traço do esperado, legendas dos dois lados e a linha de baixo; `size="lg"` para a barra de conversão), na web e no celular. A variação é lida com o sentido ("alta de 12%"): mensagens `increase`, `decrease` e `noChange` no provider. Progress: o traço da meta acompanha a altura da barra; no celular, `accessibilityValue` troca o valor lido.

### Patch Changes

- Updated dependencies [358a6db]
- Updated dependencies [76c73f4]
- Updated dependencies [d4cc0d0]
- Updated dependencies [12511a7]
- Updated dependencies [3a43a5b]
  - @countify-oficial/provider@0.4.0

## 0.5.9

### Patch Changes

- 7f1108b: SkeletonMask: título e span que contêm outros blocos (o cabeçalho do Accordion) ficam como recipientes, e cada elemento de dentro vira o próprio bloco: o ícone, a linha de cima e a de baixo.

## 0.5.8

### Patch Changes

- e6979cd: SkeletonMask: botão que contém outros blocos de conteúdo (o cabeçalho do Accordion, um cartão clicável) fica como cartão, e só os elementos de dentro viram barras. O botão comum continua um bloco só.

## 0.5.7

### Patch Changes

- 342a174: Select com busca: ao clicar ou entrar no campo, o texto do item escolhido fica selecionado e a primeira tecla o troca pela busca (antes somava ao texto e o filtro não achava nada).

## 0.5.6

### Patch Changes

- acf6460: Modal: só fecha pelo véu quando o clique começa e termina nele. Selecionar o texto de um campo arrastando até fora da janela não fecha mais.

## 0.5.5

### Patch Changes

- 97c49cd: Input: só um botão (ActionIcon) na seção da direita encosta na borda; o Loader e os ícones ficam no recuo normal, longe da margem.

## 0.5.4

### Patch Changes

- ab4057f: Accordion: o anel dos cartões ("separated" e "contained") é uma borda de verdade, como o do Paper, e o destaque do cabeçalho ao passar o mouse não o cobre mais; o destaque só arredonda nos cantos de fora do cartão (no meio da lista "contained" ele é reto, e aberto ele se emenda com o painel).

## 0.5.3

### Patch Changes

- Updated dependencies [fe5fdc5]
  - @countify-oficial/tokens@0.5.0
  - @countify-oficial/provider@0.3.1

## 0.5.2

### Patch Changes

- aec9368: Table: bordas separadas (border-spacing 0). Com o cabeçalho fixo, o conteúdo não aparece mais pelas linhas de borda ao rolar.

## 0.5.1

### Patch Changes

- 1998680: Table com stickyHeader: o cabeçalho inteiro gruda no topo ao rolar. Com duas linhas (grupos de colunas em cima), a de baixo não cobre mais a de cima.

## 0.5.0

### Minor Changes

- 70568ce: - Janela sobre janela (Modal e Drawer): o Tab anda na de cima (antes voltava sempre ao primeiro botão dela) e o Esc fecha só a de cima. Um Popover com `trapFocus` dentro de um Modal também volta a prender o Tab.
  - Select, Autocomplete, MultiSelect e TagsInput: sair do campo com Tab fecha a lista.
  - Mentions: Esc (ou sair do campo) dispensa a lista da menção; outra menção abre de novo.
  - NumberInput: ao sair do campo, o valor é arredondado a `decimalScale` (com 2 casas, "10,555" mostrava 10,56 e guardava 10.555).
  - TagsInput: Enter na sugestão marcada cria só ela, sem criar antes o texto digitado.
  - O `onFocus` do Autocomplete, o `onClick` do Select e do MultiSelect, os eventos de `inputProps` do MultiSelect e do TagsInput e o `aria-describedby` dos campos não são mais trocados pelos internos: somam-se a eles.
  - Icon: mil ícones iguais do Tabler esperam um só pedido, e um pedaço que não baixou é tentado de novo na próxima montagem.
  - `error={true}` no Checkbox e nos grupos (Checkbox, Radio, Switch e Chip) só marca o campo, sem um aviso vazio, como no TextInput.
  - `phoneMask`, `initials`, `selectAllState` e os ajudantes do Combobox e da árvore vêm do provider (os nomes exportados não mudam).

### Patch Changes

- Updated dependencies [70568ce]
- Updated dependencies [70568ce]
- Updated dependencies [70568ce]
- Updated dependencies [70568ce]
  - @countify-oficial/hooks@0.1.1
  - @countify-oficial/provider@0.3.0

## 0.4.3

### Patch Changes

- NavLink como botão (component="button"): sem a borda, o fundo cinza e a letra pequena que o navegador põe nos botões; fica igual ao NavLink de link.

## 0.4.2

### Patch Changes

- Checkbox e Radio: a caixa fica no meio da primeira linha do rótulo. O campo usava a letra pequena dos controles do navegador para medir a linha e a caixa subia 4px.

## 0.4.1

### Patch Changes

- 15bf41d: SkeletonMask: a célula de tabela com um controle (campo, lista, botão) não pinta o próprio bloco; só o controle aparece, sem os cantos de um bloco quadrado atrás do campo.
- f4806b4: SkeletonMask: as caixas de marcar e as opções viram blocos (a opção redonda, sem o desenho do sistema, sem o visto nem o ponto), e os inputs invisíveis do SegmentedControl, do Chip e do Switch não aparecem mais no pulso. O SegmentedControl perde a moldura branca e cada segmento vira um bloco. O campo fica com a própria superfície, sem borda, com um bloco de uma linha onde o valor estaria (ícones, setas e o botão do calendário somem), e não engole mais o rótulo nem o botão ao lado. Botões, chips e segmentos ficam com o próprio canto; texto, ícones e células, com o 4 do Skeleton.
- 4d1dd97: SkeletonMask: título, parágrafo, rótulo, legenda e descrição viram uma barra da largura do texto (no lugar dele, também centralizado ou no fim), e não da linha toda; nada ao lado se move. O "?" do HelpTip vira o círculo do ícone, na linha do título. O Slider fica com o trilho e a bolinha, a barra de progresso e a figura (`role="img"`: o Avatar sem foto, uma prévia desenhada com caixas) viram um bloco só, e o Badge dot fica com o ponto redondo e a barra do texto. A célula com uma caixa de marcar mostra só a caixa. Bloco dentro de bloco pulsa junto com o de fora, e o desativado tem o mesmo tom dos outros.

## 0.4.0

### Minor Changes

- f465573: SkeletonMask (web): `<SkeletonMask visible>` mostra o conteúdo de verdade, no mesmo lugar e tamanho, como os blocos do Skeleton (texto, campos, botões, abas, etiquetas, ícones, imagens e células), com os cartões e fundos no lugar. Enquanto visível, o conteúdo fica `inert`, com `aria-busy` e o status "Carregando"; sem `visible`, é um invólucro sem caixa (`display: contents`).
- 6b9d730: Tabler Icons (MIT, `@tabler/icons` 3.52.0) in the design system. The new `@countify-oficial/icons-tabler` package ships
  all 5,491 outline and 1,054 filled SVGs unmodified, with the Tabler LICENSE and a manifest. `Icon` keeps the Countify
  set for its names and draws any other name from Tabler, with `variant="outline" | "filled"`. Tabler icons use
  `currentColor`, the icon-size tokens and the Countify stroke token (`iconGrid.stroke`). On the web each Tabler icon is
  loaded on demand, one module per icon. On React Native the icons are bundled and only read when used.

### Patch Changes

- d1aa444: Anchor com `component="button"` fica igual ao link: sai o fundo, a borda e o recuo de botão do navegador.
- 5d5b520: Menu comprido não passa mais da tela: a lista vai até a altura que cabe (o `size` do Floating UI) e rola por dentro; as setas trazem o item ativo para a vista. A lista do ComboboxPopover ganha o mesmo limite das listas de seleção (6 linhas) e também rola.
- 3588660: Notification: a ação (o Button subtle do "Desfazer") e o botão de fechar usam os tokens do outro modo, porque o fundo do aviso é invertido. No claro, o "Desfazer" fica no azul #8CBAF2 sobre o aviso escuro (7,2:1, antes 2,2:1); no escuro, no #225BA5 sobre o aviso claro (6,5:1, antes 1,9:1). No aviso vermelho (`color="down"`), a ação usa o texto do outro modo (6,3:1 e 7,7:1). Na web, `data-cf-color-scheme` com o modo inverso do provider; no celular, o contexto do tema com as cores do outro modo.
- 78154fc: Skeleton e SkeletonLoader: os blocos usam a cor do chip (`--cf-color-chip`, #E8EDF3 no claro) no lugar da divisória, que quase não aparecia sobre o cartão branco e sumia sobre o fundo (aprovado em 14/11/2026).
- Updated dependencies [c0873ed]
- Updated dependencies [6b9d730]
  - @countify-oficial/tokens@0.4.0
  - @countify-oficial/icons-tabler@0.1.0
  - @countify-oficial/provider@0.2.2

## 0.3.2

### Patch Changes

- e1e5c9c: Select e os outros campos com lista (Combobox.Target) alinham a lista à caixa do campo, com a largura dela, e não ao input de dentro: a lista abria mais estreita e recuada, e quebrava o texto das opções.

## 0.3.1

### Patch Changes

- 5191144: Menu, Popover, HelpTip e as listas de seleção abriam no canto da tela (0,0): a animação de abrir sobrescrevia o transform da posição. A posição agora vai em left/top. No NativeSelect (e em qualquer campo com seção da direita sem clique), a seta fica por cima do campo, que vai de borda a borda: clicar na seta ou na borda abre a lista.

## 0.3.0

### Minor Changes

- 5a0d5d0: Papel de cor `controlBorder` (contorno de controle): o texto 3 de cada modo, com 3:1 ou mais sobre os fundos, usado no contorno de campos, PinInput, PillsInput, seleção, caixa de marcar e opção. Na Table, `verticalSpacing` muda o espaço acima e abaixo das células (com 2, linhas mais baixas).

### Patch Changes

- Updated dependencies [5a0d5d0]
  - @countify-oficial/tokens@0.3.0
  - @countify-oficial/provider@0.2.1

## 0.2.1

### Patch Changes

- 0d58071: O anel de Paper, Card e Table.ScrollContainer passa a ser uma borda de verdade. Em sombra interna, o fundo de um filho (o cabeçalho fixo ou a linha destacada de uma tabela) cobria a linha do anel.

## 0.2.0

### Minor Changes

- dffe040: PageHeader (cabeçalho de página com o voltar e as ações), Section (título de seção com o "?" e o que vai à direita), HelpTip (o "?" de ajuda) e FilterChip (chip de filtro com seta), tirados da aplicação no countify-label. Tokens novos: screenHeaderHeight, pageTitleTracking, helpIconSize e filterChipChevronSize. Mensagem `help` no provider.

### Patch Changes

- eeae023: className e style soltos chegam nas partes de componentes compostos sem raiz (Tabs.List, Tabs.Tab, Tabs.Panel, Menu.Dropdown, Menu.Item, Popover.Dropdown, HoverCard.Dropdown, Combobox.Dropdown, Combobox.Option); antes eram ignorados em silêncio.
- Updated dependencies [dffe040]
  - @countify-oficial/tokens@0.2.0
  - @countify-oficial/provider@0.2.0
