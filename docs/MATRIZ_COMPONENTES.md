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
| AppShell | ok | ok | adaptado | a moldura da identidade: abas embaixo abaixo de 768; cabeçalho de 64 com o menu só com ícones de 768 a 1279 e com os nomes a partir de 1280. No celular, as margens do sistema vêm de `safeAreaInsets` (do react-native-safe-area-context, que o app já usa) |
| Splitter | ok | ok | N/A | no celular a identidade mostra "a lista, depois o detalhe" (`X-DocNavegacao`); não há painéis lado a lado |
| ScrollArea | ok | ok | adaptado | na web, barra fina na cor da borda forte e entra no Tab; no celular, o ScrollView com a barra do sistema |
| Scroller | ok | ok | adaptado | na web, setas nas pontas quando há mais conteúdo; no celular, rola com o dedo |

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
| Toolbar | ok | ok | adaptado | na web, uma parada no Tab e setas entre os botões (padrão toolbar do WAI-ARIA); no celular, a barra com o papel toolbar |

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
| Marquee | ok | ok | adaptado | 50 px/s (aprovado em 13/11/2026); para com o mouse ou o foco na web e enquanto o dedo segura no celular; parada para quem pediu menos movimento |

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
| FloatingIndicator | ok | ok | N/A | depende do tamanho medido no DOM; no celular, Tabs e SegmentedControl já desenham o escolhido |
| FloatingWindow | ok | ok | N/A | janela que se arrasta é do computador; no celular, use Drawer |
| Tour | ok | ok | adaptado | no celular os passos aparecem numa folha, sem recorte em volta do alvo |
| Menubar | ok | ok | N/A | barra de menus do aplicativo de computador (Electron); no celular, a navegação é o menu de abas embaixo |

### Combobox

| Componente | Web | Electron | Celular | Motivo |
|---|---|---|---|---|
| Combobox | ok | ok | adaptado | na web, o padrão WAI-ARIA 1.2 (o foco fica no campo; `aria-activedescendant`); no celular, as opções abrem numa folha |
| Select | ok | ok | adaptado | no celular, o campo abre a folha com as opções (e a busca, com searchable) |
| MultiSelect | ok | ok | adaptado | igual ao Select; a folha marca e desmarca sem fechar |
| Autocomplete | ok | ok | adaptado | no celular, as sugestões aparecem logo abaixo do campo (não flutuam) |
| TagsInput | ok | ok | adaptado | no celular, o "OK" do teclado cria a etiqueta; as sugestões ficam só na web |
| Pill, PillsInput | ok | ok | ok | |
| ComboboxPopover | ok | ok | adaptado | no celular abre na folha (o "Chip de filtro" do mockup: "mostra a escolha e abre a folha") |
| Cascader | ok | ok | adaptado | na web, uma coluna por camada (setas andam, direita entra, esquerda volta); no celular, a folha mostra uma camada por vez, com "Voltar" |
| TreeSelect | ok | ok | adaptado | na web, a árvore abre embaixo do campo; no celular, numa folha. Com `multiple`, caixas de marcar (o pai fica meio marcado) |
| Mentions | ok | ok | adaptado | na web, a lista flutua sob o campo (a caixa de texto não pode ter papel combobox: fica `aria-controls` + `aria-activedescendant`); no celular, as pessoas aparecem logo abaixo do campo e a menção é a do fim do texto quando o sistema não informa o cursor |

### Navegação

| Componente | Web | Electron | Celular | Motivo |
|---|---|---|---|---|
| Tree | ok | ok | adaptado | na web, `role="tree"` com setas, Home/End, direita abre, esquerda fecha ou volta ao pai; no celular, linhas de 44 que abrem e fecham ao toque (o React Native não tem papel de árvore: cada linha anuncia aberta/fechada e escolhida/marcada) |
| Tabs | ok | ok | adaptado | variantes da identidade: segmented (o "Segmentado"), pills (a pílula do menu) e chips (a fileira de `M-Instalacao`, que rola). No celular, sem teclado: tocar abre; os chips rolam num ScrollView; sem orientação vertical |
| NavLink | ok | ok | ok | a "Lista: Linha de 64"; com filhos, abre um nível abaixo |
| Pagination | ok | ok | ok | não há paginação no mockup (ele usa "Ver todos" no fim da lista); botões de 44 com canto 12, como as setas de mês. `withPages={false}` é a forma compacta da 0.1.0 ("21–40 de 340") |
| Stepper | ok | ok | ok | barras da 0.1.0 (o mockup não tem passos) e "2 de 4 · Nome"; com `onStepClick`, as barras viram botões de 44 |
| Burger | ok | ok | ok | ícone `menu` aprovado em 13/11/2026; a identidade não esconde o menu (abas embaixo no celular, menu no topo no computador) |
| Breadcrumbs | ok | ok | N/A | no celular, a identidade usa o cabeçalho com Voltar ("Voltar leva à tela de origem", `X-DocNavegacao`) |
| TableOfContents | ok | ok | N/A | segue títulos com âncora (`#id`) e a rolagem da página, que não existem no React Native; no celular, use NavLink numa lista |

## Pacotes de extensão

| Pacote | Web | Electron | Celular | Motivo |
|---|---|---|---|---|
| notifications | ok | ok | adaptado | `notifications.show()` de qualquer lugar; um aviso por vez, some em 4 s (0.1.0). Na web, para com o mouse ou o foco; no celular, fica acima das abas e recebe `bottomInset` (área dos gestos) |
| modals | ok | ok | ok | `modals.open()`, `openConfirmModal()` (o "Alerta no centro" do W-Confirmar e do M-Confirmar) e `openContextModal()` com janelas registradas no `ModalsProvider` |
| dates: Calendar | ok | ok | ok | o calendário do M-Periodo nas duas plataformas (escolha de 13/11/2026); na web, `role="grid"` com setas, PageUp/PageDown e Home/End |
| dates: DatePicker | ok | ok | adaptado | campo de 56 (M-Espaco) que abre o calendário: popover na web, folha no celular (painel de 380 no tablet). Período e atalhos usam "Aplicar"; atalhos em chips no celular e em lista ao lado a partir de 768 (W-Periodo) |
| dates: DateInput | ok | ok | adaptado | data digitada com máscara (48, OutraData); o ícone abre o calendário (popover na web, folha no celular) |
| dates: DateTimePicker | ok | ok | adaptado | dia e hora na mesma janela; o mockup não tem seletor de hora, então a hora é o campo de 24 h |
| dates: TimeInput | ok | ok | ok | campo de texto de 24 h ("10:00"), como Abre e Fecha do M-Loja: sem ícone nem lista |
| charts: LineChart, BarChart, BarList, ScatterChart, Heatmap, FunnelChart | ok | ok | ok | os gráficos do mockup (W-Hoje, W-Comparar, W-Montar, M-Montar, W-Analises, W-Indicadores), em SVG nas duas plataformas (react-native-svg no celular); a tabela de dados vai escondida na web e vira o resumo falado no celular |
| charts: AreaChart, PieChart, DonutChart, RadarChart, Sparkline | ok | ok | ok | a identidade não desenha esses tipos; feitos com valores aprovados em 13/11/2026, **a confirmar com o design** |
| charts: ChartLegend | ok | ok | ok | a legenda do mockup (linha de 20 × 8, quadrado de 12) |

