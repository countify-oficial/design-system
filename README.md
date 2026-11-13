# design-system

Biblioteca de componentes da Countify para **web (React), Electron e React Native**, com a identidade visual da
Countify e API própria. Monorepo pnpm + Turborepo, TypeScript estrito.

## Pacotes

| Pacote | O que tem | Situação |
|---|---|---|
| `@countify-oficial/tokens` | cores (escalas de 10 tons e papéis por modo), letra, espaço, cantos, tamanhos xs–xl, sombras, camadas, movimento, pontos de quebra; em TS, variáveis CSS e objeto para React Native | pronto (0.1.0) |
| `@countify-oficial/hooks` | `useControllableState`, `useDisclosure`, `useDebounce`, `useId`, `useMediaQuery`, `useClipboard`, `useReducedMotion`; web e React Native | pronto (0.1.0) |
| `@countify-oficial/provider` | `CountifyProvider` e `useCountifyTheme`: tema (ajustes por componente), modo claro, escuro ou automático, textos (i18n); web e React Native | pronto (0.1.0) |
| `@countify-oficial/tsconfig`, `@countify-oficial/eslint-config` | configurações compartilhadas (privados, não publicados) | pronto |
| `@countify-oficial/core` | componentes da web e do Electron (React + CSS Modules). Primitivos: `Box`, `UnstyledButton`, `Text`, `Portal`, `Transition`, `FocusTrap`, `VisuallyHidden`. Layout: `Stack`, `Group`, `Flex`, `Center`, `Space`, `AspectRatio`, `SimpleGrid`, `Grid`, `Container`, `AppShell`, `Splitter`, `ScrollArea`, `Scroller`. Botões: `Icon`, `Loader`, `Button`, `ActionIcon`, `CloseButton`, `CopyButton`, `FileButton`, `Toggle`, `Toolbar`. Feedback: `Paper`, `Card`, `Divider`, `Badge`, `ThemeIcon`, `Avatar`, `Indicator`, `Kbd`, `Skeleton`, `SkeletonLoader`, `Progress`, `RingProgress`, `SemiCircleProgress`, `Alert`, `Notification`, `EmptyState`. Tipografia: `Title`, `Code`, `Mark`, `Highlight`, `Blockquote`, `List`, `Anchor`, `Typography`. Dados: `Image`, `BackgroundImage`, `ColorSwatch`, `NumberFormatter`, `RollingNumber`, `OverflowList`, `Table`, `DataList`, `Timeline`, `Spoiler`, `Collapse`, `Accordion`, `Marquee`. Campos: `Input`, `InputBase`, `TextInput`, `Textarea`, `PasswordInput`, `NumberInput`, `NativeSelect`, `FileInput`, `JsonInput`, `MaskInput`, `PhoneInput`, `PinInput`, `Fieldset`. Escolhas: `Checkbox`, `Radio`, `Switch`, `Chip` (com `.Group`), `SegmentedControl`, `Rating`, `Slider`, `RangeSlider`, `AngleSlider`, `HueSlider`, `AlphaSlider`, `ColorPicker`, `ColorInput`. Sobreposições: `Overlay`, `LoadingOverlay`, `Modal`, `Drawer`, `Dialog`, `Affix`, `ActionBar`, `Popover`, `Tooltip`, `HoverCard`, `Menu`, `FloatingIndicator`, `FloatingWindow`, `Tour`, `Menubar`. Combobox: `Combobox`, `Select`, `Autocomplete`, `MultiSelect`, `TagsInput`, `Pill`, `PillsInput`, `ComboboxPopover`, `Cascader`, `TreeSelect`, `Mentions`. Navegação: `Tree`, `Tabs`, `NavLink`, `Pagination`, `Stepper`, `Burger`, `Breadcrumbs`, `TableOfContents` | em andamento (0.1.0) |
| `@countify-oficial/native` | componentes do React Native, com a API do core. Primitivos: `Box`, `UnstyledButton`, `Text`, `Transition`. Layout: os mesmos da web, menos `Splitter`. Botões: os mesmos, menos `FileButton`. Feedback: os mesmos 16. Tipografia e dados: os mesmos, menos `Typography` e `Table`. Campos: os mesmos, menos `NativeSelect` e `FileInput`. Escolhas: as mesmas. Sobreposições: as mesmas, menos `FloatingIndicator`, `FloatingWindow` e `Menubar` (`Popover`, `Menu` e `HoverCard` abrem numa folha). Combobox: os mesmos 11 (as listas abrem numa folha). Navegação: `Tree`, `Tabs`, `NavLink`, `Pagination`, `Stepper`, `Burger` (sem `Breadcrumbs` e `TableOfContents`) | em andamento (0.1.0) |
| `@countify-oficial/notifications` | avisos rápidos de qualquer lugar: `notifications.show()`, `update()`, `hide()`, `clean()` e o `<Notifications />` que os desenha (web e React Native) | em andamento (0.1.0) |
| `@countify-oficial/modals` | janelas abertas por função: `modals.open()`, `openConfirmModal()`, `openContextModal()` e o `ModalsProvider` (web e React Native) | em andamento (0.1.0) |
| `@countify-oficial/test-utils` | interno: a preparação do jsdom e o axe dos testes da web dos pacotes de extensão | privado |
| `apps/docs` | Storybook da web: cada componente com variantes, tamanhos, estados e a tabela de props | em andamento |
| pacotes de extensão (`dates`, `charts`…) | componentes | próximos passos |

A origem de cada token está em [docs/TOKENS_COUNTIFY.md](docs/TOKENS_COUNTIFY.md); a organização do repositório em
[docs/ARQUITETURA.md](docs/ARQUITETURA.md); como contribuir em [docs/CONTRIBUINDO.md](docs/CONTRIBUINDO.md).
A versão anterior (`@countify/ui` 0.1.0, pacote único) está em `legacy/ui/`, só como referência.

## Usar os tokens

```ts
import { colors, palette, spacing } from "@countify-oficial/tokens";   // TS
import "@countify-oficial/tokens/tokens.css";                           // web: variáveis --cf-*
import { nativeTokens } from "@countify-oficial/tokens";               // React Native
```

Na web, o modo segue o sistema; `data-cf-color-scheme="dark"` (ou `"light"`) num elemento força o modo dele para baixo.

## Tema e modo

```tsx
import "@countify-oficial/tokens/tokens.css";   // só na web
import { CountifyProvider, createTheme, useCountifyTheme } from "@countify-oficial/provider";

const theme = createTheme({ components: { Button: { defaultProps: { size: "sm" } } } });

<CountifyProvider theme={theme} defaultColorScheme="auto">   {/* "light", "dark" ou "auto" */}
  <App />
</CountifyProvider>;

const { colorScheme, colors, setColorScheme, messages } = useCountifyTheme();
```

O mesmo import serve à web e ao React Native: o Metro pega a versão nativa sozinho (condição `react-native`).
Textos padrão em pt-BR; para trocar, `messages={{ close: "Close" }}`. Números (e datas, depois) seguem `locale` (padrão `pt-BR`):
`formatNumber(1284.5)` dá `1.284,5`.

## Componentes

```tsx
// web e Electron
import "@countify-oficial/tokens/fonts.css";    // a Roboto do pacote (sem internet, CSP fechado)
import "@countify-oficial/tokens/tokens.css";
import "@countify-oficial/core/styles.css";
import { Text, UnstyledButton } from "@countify-oficial/core";

<Text size="sm" color="text2" weight="medium">Vendas de hoje</Text>
<Text component="h2" size="xl" weight="bold" classNames={{ root: "titulo" }}>Lojas</Text>

// React Native: mesmos nomes e props
import { Text, UnstyledButton } from "@countify-oficial/native";
```

Ícones: `<Icon name="search" />`, com os ícones da Countify (lista em `@countify-oficial/tokens`, `icons`). No celular,
o `Icon` usa o `react-native-svg` (`npx expo install react-native-svg`) e a Roboto vem do `@expo-google-fonts/roboto`.

Props comuns: `size` (xs–xl), `color` (papel de cor dos tokens), `component` (troca o elemento), `disabled`; na web,
`className`, `style`, `classNames` e `styles` por parte. Espaço (`gap`, `spacing`…): `xs`–`xl` ou um degrau da grade de
4 (`3` = 12, `5` = 20). Colunas e span aceitam um valor por ponto de quebra: `cols={{ base: 1, sm: 2, lg: 4 }}`
(`sm` a partir de 768, `lg` a partir de 1280). O tema muda o padrão de qualquer componente:
`createTheme({ components: { Text: { defaultProps: { size: "sm" } } } })`.

Para ver todos: `pnpm build` e `pnpm --filter @countify-oficial/docs dev` (Storybook em http://localhost:6006).

## Desenvolver

Node 24.11 ou mais novo. O pnpm vem pelo corepack do Node, na versão fixada no `package.json`:

```bash
corepack enable pnpm   # uma vez por máquina
pnpm install
pnpm check             # build, tipos, lint e testes de todos os pacotes
```

## Dependências e por quê

De execução, os pacotes só pedem o que o app já tem (dependências "peer"): React 19 (e o React DOM na web), e no
celular o React Native (0.79 ou mais novo), o `expo-clipboard`, que o `useClipboard` usa
(`npx expo install expo-clipboard`), e o `react-native-svg`, que desenha os ícones (a especificação já o previa para
os gráficos). As animações do celular usam o `Animated` do próprio React Native. As de
desenvolvimento:

| Dependência | Por quê |
|---|---|
| pnpm (workspaces) | um repositório com vários pacotes que dependem uns dos outros, sem cópia de `node_modules` |
| Turborepo | roda build, tipos, lint e testes na ordem das dependências e guarda o resultado do que não mudou |
| TypeScript 6.0 | o 7.0 ainda não tem a API em JavaScript que o typescript-eslint e a geração de `.d.ts` usam |
| tsup | gera ESM, CJS e `.d.ts` de cada pacote num comando |
| Changesets | versão e CHANGELOG por pacote a cada mudança, e a publicação |
| Vitest | testes rápidos em TS, sem configuração |
| ESLint 9 + typescript-eslint | regras com tipos; ESLint 9 porque o plugin de acessibilidade (jsx-a11y) ainda não aceita o 10 |
| eslint-plugin-react-hooks, eslint-plugin-jsx-a11y | regras dos hooks do React e de acessibilidade na web |
| Testing Library + jsdom (+ `user-event`) | testes de componente e de hook da web, como o usuário usa (o `user-event` simula o teclado de verdade, para o Tab) |
| jest-axe | testes de acessibilidade (axe-core) dos componentes da web, como a especificação pede |
| `@floating-ui/react` (no core) | posição de Popover, Tooltip, HoverCard e Menu, com as interações acessíveis (Esc, clique fora, foco, setas); previsto na especificação |
| Storybook 10 (`react-vite`, `addon-docs`, `addon-a11y`) + Vite 8 | documentação da web: as histórias de cada componente, a tabela de props lida dos comentários do código e a checagem de acessibilidade no navegador |
| Jest + React Native Testing Library (+ `@react-native/jest-preset`, Babel 7, `test-renderer`) | testes do React Native, como a especificação pede; o Vitest não roda o React Native |

Dependências de execução previstas na especificação (`@floating-ui`, react-aria ou Radix, react-native-reanimated,
react-native-gesture-handler) entram nesta tabela, com o motivo, quando o primeiro componente precisar delas.

## Publicar

Os pacotes são privados, no GitHub Packages da organização `countify-oficial`: só os membros dela instalam. O escopo
`@countify-oficial` é obrigatório lá (o GitHub exige o nome da organização).

1. Cada pessoa cria um token no GitHub (Settings → Developer settings → Personal access tokens, tipo *classic*, com
   `read:packages`; quem publica também precisa de `write:packages`) e grava no `~/.npmrc` dela, fora do repositório:
   `//npm.pkg.github.com/:_authToken=<token>`.
2. `pnpm changeset` a cada mudança; `pnpm version-packages` aplica as versões; `pnpm release` publica.

Num app que usa a biblioteca, o `.npmrc` do app leva a mesma linha `@countify-oficial:registry=https://npm.pkg.github.com`.
