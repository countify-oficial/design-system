# @countify-oficial/charts

## 0.7.0

### Minor Changes

- e17705b: Charts: SankeyChart, fluxos entre etapas com a espessura proporcional ao valor (visitantes → entraram → compraram; estoque recebido → exposto → vendido ou perdido), na web e no React Native. Colunas pela profundidade do grafo; ciclo, id repetido ou desconhecido dão erro. Tabela de dados com origem, destino e valor; dica no fluxo mais perto do mouse, do dedo ou das setas. Mensagens novas no provider: `flowSource`, `flowTarget`, `flowValue` e `chartFlow`.

### Patch Changes

- Updated dependencies [1aa5f0e]
- Updated dependencies [da0fa21]
- Updated dependencies [e17705b]
- Updated dependencies [e38b598]
- Updated dependencies [43178a7]
  - @countify-oficial/provider@0.5.0
  - @countify-oficial/core@0.7.0

## 0.6.0

### Minor Changes

- 358a6db: Charts: `BarChart` aceita várias séries (`series`), lado a lado ou empilhadas (`stacked`), nas cores das séries; o novo `ComboChart` junta barras e linhas (a meta tracejada, a conversão no eixo da direita com `rightMax` e `formatRight`); linha, área, barras e combinado mostram a dica ao passar o mouse, no foco (setas, Home, End, Esc) e no toque. Com `values`, o `BarChart` desenha igual. Provider: o texto `chartPoint` ("Ponto do gráfico"), o nome do controle da dica.

### Patch Changes

- Updated dependencies [358a6db]
- Updated dependencies [76c73f4]
- Updated dependencies [d4cc0d0]
- Updated dependencies [0dc2592]
- Updated dependencies [12511a7]
- Updated dependencies [3a43a5b]
  - @countify-oficial/provider@0.4.0
  - @countify-oficial/core@0.6.0

## 0.5.3

### Patch Changes

- Updated dependencies [fe5fdc5]
  - @countify-oficial/tokens@0.5.0
  - @countify-oficial/core@0.5.3
  - @countify-oficial/provider@0.3.1

## 0.5.0

### Patch Changes

- 70568ce: Gráficos com números negativos descem do zero dentro do desenho (antes a barra sumia e o ponto saía da tela), e números pequenos (0,02 a 0,05) enchem o eixo em vez de ficarem achatados num teto de 1; as marcas do eixo arredondam na casa do passo. React Native e `react-native-svg` saem das `peerDependencies` (opcionais só em `peerDependenciesMeta`); sai o `@countify-oficial/native`, que o pacote não usa.
- Updated dependencies [70568ce]
- Updated dependencies [70568ce]
- Updated dependencies [70568ce]
- Updated dependencies [70568ce]
- Updated dependencies [70568ce]
  - @countify-oficial/core@0.5.0
  - @countify-oficial/hooks@0.1.1
  - @countify-oficial/provider@0.3.0

## 0.1.3

### Patch Changes

- Updated dependencies [d1aa444]
- Updated dependencies [5d5b520]
- Updated dependencies [3588660]
- Updated dependencies [c0873ed]
- Updated dependencies [78154fc]
- Updated dependencies [f465573]
- Updated dependencies [6b9d730]
  - @countify-oficial/core@0.4.0
  - @countify-oficial/native@0.4.0
  - @countify-oficial/tokens@0.4.0
  - @countify-oficial/provider@0.2.2

## 0.1.2

### Patch Changes

- Updated dependencies [5a0d5d0]
  - @countify-oficial/tokens@0.3.0
  - @countify-oficial/core@0.3.0
  - @countify-oficial/native@0.3.0
  - @countify-oficial/provider@0.2.1

## 0.1.1

### Patch Changes

- Updated dependencies [dffe040]
- Updated dependencies [eeae023]
  - @countify-oficial/tokens@0.2.0
  - @countify-oficial/provider@0.2.0
  - @countify-oficial/core@0.2.0
  - @countify-oficial/native@0.2.0
