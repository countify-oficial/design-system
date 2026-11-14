---
"@countify-oficial/carousel": patch
---

Carousel da web: as setas e o contador medem de novo quando os cartões chegam depois ou a largura muda, e o `onSlideChange` só é chamado quando o cartão muda (antes, ao montar e a cada render com um callback novo). React Native sai das `peerDependencies` (opcional só em `peerDependenciesMeta`); saem `@countify-oficial/native` e `react-native-svg`, que o pacote não usa.
