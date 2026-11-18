# @countify-oficial/provider

## 0.4.0

### Minor Changes

- 76c73f4: DataTable: tabela pronta com colunas declarativas, ordenação (pt-BR e números de verdade), seleção com a barra de ações, paginação no cliente ou no servidor (`manual`), carregando e vazio. Só no computador (no celular, lista). Mensagens novas no provider: `selectRow`, `selectPageRows`, `selectedCount`, `selectionActions` e `emptyTable`.
- d4cc0d0: DataGrid: grade de edição em massa, como uma planilha (só computador). Colunas de texto, número e moeda com formato pt-BR e validação; navegação por teclado (padrão ARIA grid, roving tabindex), edição na célula com Enter, F2 ou digitando; desfazer e refazer; copiar e colar blocos do Excel; só as linhas visíveis desenhadas (10.000 linhas). Mensagens novas no provider: `invalidNumber`, `cellsCopied`, `cellsPasted`, `cellsRejected`, `undone` e `redone`.
- 12511a7: NotificationList (web e celular): a lista dos Avisos (mockups W-Avisos e M-Avisos), agrupada por dia ("hoje", "ontem", "12 de novembro"), cada aviso com ícone ou iniciais, título, loja e a hora em `<time>`; o escolhido fica em destaque (`selected`, `onSelect`), o não lido em negrito com um ponto, e há os estados vazio (EmptyState) e carregando (SkeletonLoader). Na web, uma parada no Tab e as setas andam entre os avisos. O NavLink do celular aceita `accessibilityLabel`. No provider, `groupByDay` e as mensagens `yesterday`, `unread` e `noNotifications`.
- 3a43a5b: StatCard (cartão de indicador: rótulo com o "?", número com prefixo e unidade, linha de apoio, variação com seta e lugar para um gráfico pequeno) e Meter (medidor de meta: rótulo e valor em destaque, a barra `role="meter"` com o traço do esperado, legendas dos dois lados e a linha de baixo; `size="lg"` para a barra de conversão), na web e no celular. A variação é lida com o sentido ("alta de 12%"): mensagens `increase`, `decrease` e `noChange` no provider. Progress: o traço da meta acompanha a altura da barra; no celular, `accessibilityValue` troca o valor lido.

### Patch Changes

- 358a6db: Charts: `BarChart` aceita várias séries (`series`), lado a lado ou empilhadas (`stacked`), nas cores das séries; o novo `ComboChart` junta barras e linhas (a meta tracejada, a conversão no eixo da direita com `rightMax` e `formatRight`); linha, área, barras e combinado mostram a dica ao passar o mouse, no foco (setas, Home, End, Esc) e no toque. Com `values`, o `BarChart` desenha igual. Provider: o texto `chartPoint` ("Ponto do gráfico"), o nome do controle da dica.

## 0.3.1

### Patch Changes

- Updated dependencies [fe5fdc5]
  - @countify-oficial/tokens@0.5.0

## 0.3.0

### Minor Changes

- 70568ce: Ajudantes que a web e o celular repetiam passam a vir daqui: `hasContent` (rótulo, descrição ou erro com o que desenhar; `true` só marca), `limitNumber` (min, max e arredondamento a `decimalScale` como o campo mostra), `phoneMask`, `initials`, `isValidJson`, `decimalPlaces` e `selectAllState`. `formatNumber` e `numberSeparators` reaproveitam um `Intl.NumberFormat` por idioma e opções (3000 números formatavam em 80 ms; agora em cerca de 1 ms). O build do React Native deixa o `react-native` de fora do pacote mesmo sem estar nas `peerDependencies`.

### Patch Changes

- 70568ce: React Native sai das `peerDependencies` (opcional só em `peerDependenciesMeta`): vindo do GitHub Packages, o npm o tratava como obrigatório e instalava o React Native num app de Electron.
- Updated dependencies [70568ce]
- Updated dependencies [70568ce]
  - @countify-oficial/hooks@0.1.1

## 0.2.2

### Patch Changes

- Updated dependencies [c0873ed]
  - @countify-oficial/tokens@0.4.0

## 0.2.1

### Patch Changes

- Updated dependencies [5a0d5d0]
  - @countify-oficial/tokens@0.3.0

## 0.2.0

### Minor Changes

- dffe040: PageHeader (cabeçalho de página com o voltar e as ações), Section (título de seção com o "?" e o que vai à direita), HelpTip (o "?" de ajuda) e FilterChip (chip de filtro com seta), tirados da aplicação no countify-label. Tokens novos: screenHeaderHeight, pageTitleTracking, helpIconSize e filterChipChevronSize. Mensagem `help` no provider.

### Patch Changes

- Updated dependencies [dffe040]
  - @countify-oficial/tokens@0.2.0
