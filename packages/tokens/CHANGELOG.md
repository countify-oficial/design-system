# @countify-oficial/tokens

## 0.5.0

### Minor Changes

- fe5fdc5: Densidade compacta: no computador com janela pequena (até 1600 × 860, como o notebook de 1366 × 768), o tokens.css reduz letra (texto 15/14/13), títulos (página e número 24, seção 17), altura de botões e campos (sm/md 36/40), botão de ícone (36), linha de lista (48) e margem lateral (24). Em monitor grande e no celular, nada muda. A escala fica em `compactDensity`.

## 0.4.0

### Minor Changes

- c0873ed: O `tokens.css` põe a barra de rolagem do ScrollArea na página toda: `scrollbar-width: thin` e `scrollbar-color: var(--cf-color-border-strong) transparent` no `:root` e em cada modo (as duas herdam). Toda área que rola num app da Countify deixa a barra padrão do navegador.

## 0.3.0

### Minor Changes

- 5a0d5d0: Papel de cor `controlBorder` (contorno de controle): o texto 3 de cada modo, com 3:1 ou mais sobre os fundos, usado no contorno de campos, PinInput, PillsInput, seleção, caixa de marcar e opção. Na Table, `verticalSpacing` muda o espaço acima e abaixo das células (com 2, linhas mais baixas).

## 0.2.0

### Minor Changes

- dffe040: PageHeader (cabeçalho de página com o voltar e as ações), Section (título de seção com o "?" e o que vai à direita), HelpTip (o "?" de ajuda) e FilterChip (chip de filtro com seta), tirados da aplicação no countify-label. Tokens novos: screenHeaderHeight, pageTitleTracking, helpIconSize e filterChipChevronSize. Mensagem `help` no provider.
