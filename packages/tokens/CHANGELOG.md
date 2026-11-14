# @countify-oficial/tokens

## 0.4.0

### Minor Changes

- c0873ed: O `tokens.css` põe a barra de rolagem do ScrollArea na página toda: `scrollbar-width: thin` e `scrollbar-color: var(--cf-color-border-strong) transparent` no `:root` e em cada modo (as duas herdam). Toda área que rola num app da Countify deixa a barra padrão do navegador.

## 0.3.0

### Minor Changes

- 5a0d5d0: Papel de cor `controlBorder` (contorno de controle): o texto 3 de cada modo, com 3:1 ou mais sobre os fundos, usado no contorno de campos, PinInput, PillsInput, seleção, caixa de marcar e opção. Na Table, `verticalSpacing` muda o espaço acima e abaixo das células (com 2, linhas mais baixas).

## 0.2.0

### Minor Changes

- dffe040: PageHeader (cabeçalho de página com o voltar e as ações), Section (título de seção com o "?" e o que vai à direita), HelpTip (o "?" de ajuda) e FilterChip (chip de filtro com seta), tirados da aplicação no countify-label. Tokens novos: screenHeaderHeight, pageTitleTracking, helpIconSize e filterChipChevronSize. Mensagem `help` no provider.
