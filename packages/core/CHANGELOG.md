# @countify-oficial/core

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
