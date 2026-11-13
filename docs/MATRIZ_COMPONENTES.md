# Matriz de componentes

Componente × plataforma. **ok**: igual nas três. **adaptado**: mesma API, comportamento próprio da plataforma
(motivo na coluna). **N/A**: não existe naquela plataforma (motivo na coluna).

## Tema e hooks

| Item | Web | Electron | Celular | Motivo |
|---|---|---|---|---|
| CountifyProvider | ok | ok | adaptado | na web grava `data-cf-color-scheme` no `<html>`; no celular lê o modo do aparelho |
| useControllableState, useDisclosure, useDebounce, useId | ok | ok | ok | |
| useMediaQuery | ok | ok | adaptado | no celular só `min-width`, `max-width` e `prefers-color-scheme`, contra a tela atual |
| useClipboard | ok | ok | adaptado | no celular usa o `expo-clipboard`; na web pede página segura (https ou localhost) |
| useReducedMotion | ok | ok | adaptado | na web, `prefers-reduced-motion`; no celular, o ajuste do aparelho (`AccessibilityInfo`) |

## Componentes

### Primitivos

| Componente | Web | Electron | Celular | Motivo |
|---|---|---|---|---|
| Box | ok | ok | adaptado | no celular é uma `View` |
| UnstyledButton | ok | ok | adaptado | no celular é um `Pressable`, com alvo de toque mínimo de 44 |
| Text | ok | ok | adaptado | no celular, `truncate` e `lineClamp` viram `numberOfLines`; a cor padrão é `text` (o React Native não herda a cor da tela) |
| Transition | ok | ok | adaptado | na web, `children` é uma função que recebe o estilo; no celular, os filhos vão numa `Animated.View` |
| Portal | ok | ok | N/A | o React Native não tem portal; o que fica por cima de tudo usa o `Modal` nativo |
| FocusTrap | ok | ok | N/A | no celular não há Tab; o `Modal` nativo já prende o leitor de tela |
| VisuallyHidden | ok | ok | N/A | no celular, o texto só para o leitor de tela vai em `accessibilityLabel` |

### Layout

| Componente | Web | Electron | Celular | Motivo |
|---|---|---|---|---|
| Stack | ok | ok | adaptado | no celular é uma `View` em coluna |
| Group | ok | ok | adaptado | com `grow`, no celular cada item vai numa `View` que cresce (o React Native não estiliza os filhos pelo pai) |
| Flex | ok | ok | adaptado | no celular a direção padrão também é linha, como na web |
| Center | ok | ok | adaptado | no celular, `inline` encolhe ao conteúdo (`alignSelf`), porque não existe texto em linha com `View` |
| Space | ok | ok | ok | |
| AspectRatio | ok | ok | adaptado | na web, imagem, vídeo e iframe dentro preenchem a caixa; no celular, a `Image` precisa de largura e altura 100% |
| SimpleGrid | ok | ok | adaptado | no celular, colunas pela largura da tela; células em porcentagem (o React Native não tem grid) |
| Grid | ok | ok | adaptado | igual ao SimpleGrid; o `Grid.Col` lê colunas e espaço do `Grid` |
| Container | ok | ok | adaptado | no celular, a margem segue a largura da tela (32 em tablet a partir de 768) |
