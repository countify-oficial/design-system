# @countify-oficial/provider

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
