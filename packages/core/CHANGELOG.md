# @countify-oficial/core

## 0.2.0

### Minor Changes

- dffe040: PageHeader (cabeçalho de página com o voltar e as ações), Section (título de seção com o "?" e o que vai à direita), HelpTip (o "?" de ajuda) e FilterChip (chip de filtro com seta), tirados da aplicação no countify-label. Tokens novos: screenHeaderHeight, pageTitleTracking, helpIconSize e filterChipChevronSize. Mensagem `help` no provider.

### Patch Changes

- eeae023: className e style soltos chegam nas partes de componentes compostos sem raiz (Tabs.List, Tabs.Tab, Tabs.Panel, Menu.Dropdown, Menu.Item, Popover.Dropdown, HoverCard.Dropdown, Combobox.Dropdown, Combobox.Option); antes eram ignorados em silêncio.
- Updated dependencies [dffe040]
  - @countify-oficial/tokens@0.2.0
  - @countify-oficial/provider@0.2.0
