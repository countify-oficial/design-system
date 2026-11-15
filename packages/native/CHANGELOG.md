# @countify-oficial/native

## 0.5.3

### Patch Changes

- Updated dependencies [fe5fdc5]
  - @countify-oficial/tokens@0.5.0
  - @countify-oficial/provider@0.3.1

## 0.5.0

### Minor Changes

- 70568ce: NumberInput: ao sair do campo, o valor é arredondado a `decimalScale`, como o campo mostra. `error={true}` no Checkbox, nos grupos e nos campos de escolha só marca, sem texto vazio. `phoneMask`, `initials`, `selectAllState`, a conferência do JsonInput e as casas do passo do Slider vêm do provider (os nomes exportados não mudam).

### Patch Changes

- 70568ce: PinInput: a caixa é selecionada ao focar, e digitar numa caixa cheia troca o algarismo (antes o novo ia para a caixa seguinte).
- Updated dependencies [70568ce]
- Updated dependencies [70568ce]
- Updated dependencies [70568ce]
- Updated dependencies [70568ce]
  - @countify-oficial/hooks@0.1.1
  - @countify-oficial/provider@0.3.0

## 0.4.0

### Minor Changes

- 6b9d730: Tabler Icons (MIT, `@tabler/icons` 3.52.0) in the design system. The new `@countify-oficial/icons-tabler` package ships
  all 5,491 outline and 1,054 filled SVGs unmodified, with the Tabler LICENSE and a manifest. `Icon` keeps the Countify
  set for its names and draws any other name from Tabler, with `variant="outline" | "filled"`. Tabler icons use
  `currentColor`, the icon-size tokens and the Countify stroke token (`iconGrid.stroke`). On the web each Tabler icon is
  loaded on demand, one module per icon. On React Native the icons are bundled and only read when used.

### Patch Changes

- 3588660: Notification: a ação (o Button subtle do "Desfazer") e o botão de fechar usam os tokens do outro modo, porque o fundo do aviso é invertido. No claro, o "Desfazer" fica no azul #8CBAF2 sobre o aviso escuro (7,2:1, antes 2,2:1); no escuro, no #225BA5 sobre o aviso claro (6,5:1, antes 1,9:1). No aviso vermelho (`color="down"`), a ação usa o texto do outro modo (6,3:1 e 7,7:1). Na web, `data-cf-color-scheme` com o modo inverso do provider; no celular, o contexto do tema com as cores do outro modo.
- 78154fc: Skeleton e SkeletonLoader: os blocos usam a cor do chip (`--cf-color-chip`, #E8EDF3 no claro) no lugar da divisória, que quase não aparecia sobre o cartão branco e sumia sobre o fundo (aprovado em 14/11/2026).
- Updated dependencies [c0873ed]
- Updated dependencies [6b9d730]
  - @countify-oficial/tokens@0.4.0
  - @countify-oficial/icons-tabler@0.1.0
  - @countify-oficial/provider@0.2.2

## 0.3.0

### Minor Changes

- 5a0d5d0: Papel de cor `controlBorder` (contorno de controle): o texto 3 de cada modo, com 3:1 ou mais sobre os fundos, usado no contorno de campos, PinInput, PillsInput, seleção, caixa de marcar e opção. Na Table, `verticalSpacing` muda o espaço acima e abaixo das células (com 2, linhas mais baixas).

### Patch Changes

- Updated dependencies [5a0d5d0]
  - @countify-oficial/tokens@0.3.0
  - @countify-oficial/provider@0.2.1

## 0.2.0

### Minor Changes

- dffe040: PageHeader (cabeçalho de página com o voltar e as ações), Section (título de seção com o "?" e o que vai à direita), HelpTip (o "?" de ajuda) e FilterChip (chip de filtro com seta), tirados da aplicação no countify-label. Tokens novos: screenHeaderHeight, pageTitleTracking, helpIconSize e filterChipChevronSize. Mensagem `help` no provider.

### Patch Changes

- Updated dependencies [dffe040]
  - @countify-oficial/tokens@0.2.0
  - @countify-oficial/provider@0.2.0
