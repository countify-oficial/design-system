---
"@countify-oficial/charts": patch
---

Gráficos com números negativos descem do zero dentro do desenho (antes a barra sumia e o ponto saía da tela), e números pequenos (0,02 a 0,05) enchem o eixo em vez de ficarem achatados num teto de 1; as marcas do eixo arredondam na casa do passo. React Native e `react-native-svg` saem das `peerDependencies` (opcionais só em `peerDependenciesMeta`); sai o `@countify-oficial/native`, que o pacote não usa.
