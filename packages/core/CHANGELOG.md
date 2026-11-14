# @countify-oficial/core

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
