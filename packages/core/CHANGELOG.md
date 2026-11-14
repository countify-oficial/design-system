# @countify-oficial/core

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
