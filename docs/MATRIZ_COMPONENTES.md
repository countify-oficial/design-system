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

### Botões

| Componente | Web | Electron | Celular | Motivo |
|---|---|---|---|---|
| Icon | ok | ok | adaptado | no celular, `react-native-svg` (`SvgXml`) com o mesmo desenho; a cor padrão vem do botão em volta (`ContentColor`), porque o React Native não herda cor |
| Loader | ok | ok | adaptado | no celular, o girador do sistema (`ActivityIndicator`): pequeno até md, grande em lg e xl |
| Button | ok | ok | adaptado | no celular é um `Pressable`; ao tocar, opacidade 0,8 em vez do véu do hover; numa coluna ocupa a largura toda |
| ActionIcon | ok | ok | adaptado | no celular o nome vai em `accessibilityLabel` (na web, `aria-label`) |
| CloseButton | ok | ok | adaptado | igual ao ActionIcon |
| CopyButton | ok | ok | adaptado | no celular copia pelo `expo-clipboard` |
| FileButton | ok | ok | N/A | o React Native não tem seletor de arquivo; o app usa o `expo-document-picker` ou o `expo-image-picker` |
| Toggle | ok | ok | adaptado | no celular, papel `togglebutton` com `accessibilityState.checked` (na web, `aria-pressed`) |

### Feedback e superfícies

| Componente | Web | Electron | Celular | Motivo |
|---|---|---|---|---|
| Paper | ok | ok | adaptado | no celular o anel vira borda fina (o React Native não tem sombra por dentro) |
| Card | ok | ok | adaptado | igual ao Paper; o `Card.Section` sabe se é o primeiro ou o último pelo `Card` (não há `:first-child`) |
| Divider | ok | ok | ok | |
| Badge | ok | ok | ok | |
| ThemeIcon | ok | ok | adaptado | no celular passa a cor ao ícone por `ContentColor` |
| Avatar | ok | ok | adaptado | no celular a foto é uma `Image` (`uri`) |
| Indicator | ok | ok | ok | |
| Kbd | ok | ok | ok | no celular serve a teclado físico (tablet) |
| Skeleton | ok | ok | adaptado | no celular pulsa com `Animated`; para com "reduzir movimento" |
| SkeletonLoader | ok | ok | ok | não existe no Mantine: as formas do "Carregando" da Countify prontas (texto, cartões de número, lista, cartão) |
| Progress | ok | ok | ok | |
| RingProgress | ok | ok | adaptado | no celular, `react-native-svg` |
| SemiCircleProgress | ok | ok | adaptado | no celular, `react-native-svg` |
| Alert | ok | ok | adaptado | no celular, `accessibilityLiveRegion` (Android) e papel `alert`; o contêiner não agrupa, para o botão de fechar continuar alcançável |
| Notification | ok | ok | adaptado | igual ao Alert; a fila e a posição na tela ficam em `@countify-oficial/notifications` |
| EmptyState | ok | ok | ok | |

### Tipografia

| Componente | Web | Electron | Celular | Motivo |
|---|---|---|---|---|
| Title | ok | ok | adaptado | no celular, `accessibilityRole="header"` (sem h1–h6) |
| Code | ok | ok | ok | |
| Mark | ok | ok | ok | |
| Highlight | ok | ok | ok | |
| Blockquote | ok | ok | ok | |
| List | ok | ok | adaptado | no celular, marcadores e números desenhados em Text |
| Anchor | ok | ok | adaptado | no celular abre o endereço pelo sistema (`Linking`); sem hover, o sublinhado é sempre ou nunca |
| Typography | ok | ok | N/A | estiliza HTML comum; o React Native não tem HTML |

### Dados

| Componente | Web | Electron | Celular | Motivo |
|---|---|---|---|---|
| Image | ok | ok | adaptado | no celular, `Image` com `uri`; o alt vira `accessibilityLabel` |
| BackgroundImage | ok | ok | adaptado | no celular, `View` com a `Image` cobrindo o fundo (o `ImageBackground` do React Native está obsoleto) |
| ColorSwatch | ok | ok | ok | |
| NumberFormatter | ok | ok | ok | o mesmo `formatNumber` (no provider) nas duas plataformas |
| RollingNumber | ok | ok | adaptado | no celular rola com `Animated` |
| OverflowList | ok | ok | ok | conta pelos itens (`maxVisible`), não mede a largura |
| Table | ok | ok | N/A | a identidade troca a tabela por lista no celular (`X-DocNavegacao`: "Lista com mais de dois números → Tabela") |
| DataList | ok | ok | ok | |
| Timeline | ok | ok | ok | |
| Spoiler | ok | ok | adaptado | no celular mede a altura pelo `onLayout` |
| Collapse | ok | ok | adaptado | na web anima pela grade (CSS); no celular, a altura medida com `Animated` |
| Accordion | ok | ok | adaptado | no celular, `accessibilityState.expanded`; sem navegação por setas (não há teclado) |

### Campos

| Componente | Web | Electron | Celular | Motivo |
|---|---|---|---|---|
| Input, InputBase | ok | ok | adaptado | no celular o foco e o erro são borda (não há anel por dentro) e o recuo diminui junto, para o texto não pular |
| TextInput | ok | ok | ok | |
| Textarea | ok | ok | adaptado | no celular, sem autosize (o campo de várias linhas do sistema já cresce) |
| PasswordInput | ok | ok | ok | |
| NumberInput | ok | ok | adaptado | no celular, teclado numérico do sistema; sem setas do teclado |
| NativeSelect | ok | ok | N/A | o React Native não tem `<select>`; no celular, use Select (passo da Combobox), que abre a folha |
| FileInput | ok | ok | N/A | igual ao FileButton: no celular, `expo-document-picker` |
| JsonInput | ok | ok | ok | |
| MaskInput | ok | ok | ok | a máscara (`applyMask`) é a mesma nas duas plataformas |
| PhoneInput | ok | ok | ok | Brasil, com DDD; fixo e celular |
| PinInput | ok | ok | adaptado | no celular a primeira caixa recebe o código do SMS (`oneTimeCode`, `sms-otp`) |
| Fieldset | ok | ok | adaptado | no celular `disabled` bloqueia o toque no grupo (não há `<fieldset>`) |

### Escolhas

| Componente | Web | Electron | Celular | Motivo |
|---|---|---|---|---|
| Checkbox (+ Group) | ok | ok | adaptado | na web, a caixa do sistema na cor de destaque (`accent-color`, como no mockup); no celular, desenhada (o React Native não tem caixa) |
| Radio (+ Group) | ok | ok | adaptado | igual ao Checkbox |
| Switch (+ Group) | ok | ok | adaptado | na web, desenhado com as medidas do mockup; no celular, o `Switch` do sistema nas cores da identidade, com a linha toda tocável |
| Chip (+ Group) | ok | ok | ok | |
| SegmentedControl | ok | ok | adaptado | na web, setas do teclado entre as opções (são radios) |
| Rating | ok | ok | ok | a estrela foi acrescentada ao conjunto de ícones (não existia na 0.1.0) |
| Slider, RangeSlider | ok | ok | adaptado | no celular, papel `adjustable`: o leitor de tela aumenta e diminui deslizando o dedo |
| HueSlider, AlphaSlider | ok | ok | adaptado | igual ao Slider; o trilho de cor é um gradiente do `react-native-svg` |
| AngleSlider | ok | ok | adaptado | igual ao Slider |
| ColorPicker | ok | ok | adaptado | a área de saturação e brilho é um gradiente do `react-native-svg`; no leitor de tela, ajusta a saturação |

### Sobreposições

| Componente | Web | Electron | Celular | Motivo |
|---|---|---|---|---|
| Overlay | ok | ok | ok | o véu da identidade (scrim a 72%) |
| LoadingOverlay | ok | ok | ok | |
| Modal | ok | ok | adaptado | no celular, o `Modal` do sistema; o voltar do Android fecha; `accessibilityViewIsModal` |
| Drawer | ok | ok | adaptado | folha que sobe no celular e painel de 380 a partir de 768 (identidade); no celular, o `Modal` do sistema |
| Dialog | ok | ok | adaptado | no celular não há portal: ponha no topo da tela |
| Affix | ok | ok | adaptado | igual ao Dialog |
| ActionBar | ok | ok | adaptado | igual ao Dialog |
| Popover | ok | ok | adaptado | no celular abre numa folha que sobe (a identidade troca popover por folha) |
| Menu | ok | ok | adaptado | no celular, uma folha com as ações em linhas de 56 |
| HoverCard | ok | ok | adaptado | no celular não há hover: abre numa folha com o toque longo |
| Tooltip | ok | ok | adaptado | no celular aparece enquanto o dedo segura o alvo e vira a dica do leitor de tela |
| ColorInput | ok | ok | adaptado | no celular o seletor abre numa folha |
