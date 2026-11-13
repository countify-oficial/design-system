# DesignSystem

Biblioteca de componentes da Countify para **web (React), Electron e React Native**, com a identidade visual da
Countify e API própria. Monorepo pnpm + Turborepo, TypeScript estrito.

## Pacotes

| Pacote | O que tem | Situação |
|---|---|---|
| `@countify-oficial/tokens` | cores (escalas de 10 tons e papéis por modo), letra, espaço, cantos, tamanhos xs–xl, sombras, camadas, movimento, pontos de quebra; em TS, variáveis CSS e objeto para React Native | pronto (0.1.0) |
| `@countify-oficial/hooks` | `useControllableState`, `useDisclosure`, `useDebounce`, `useId`, `useMediaQuery`, `useClipboard`; web e React Native | pronto (0.1.0) |
| `@countify-oficial/provider` | `CountifyProvider` e `useCountifyTheme`: tema (ajustes por componente), modo claro, escuro ou automático, textos (i18n); web e React Native | pronto (0.1.0) |
| `@countify-oficial/tsconfig`, `@countify-oficial/eslint-config` | configurações compartilhadas (privados, não publicados) | pronto |
| `@countify-oficial/core`, `@countify-oficial/native` e os pacotes de extensão | componentes | próximos passos |

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
Textos padrão em pt-BR; para trocar, `messages={{ close: "Close" }}`.

## Desenvolver

Node 24.11 ou mais novo. O pnpm vem pelo corepack do Node, na versão fixada no `package.json`:

```bash
corepack enable pnpm   # uma vez por máquina
pnpm install
pnpm check             # build, tipos, lint e testes de todos os pacotes
```

## Dependências e por quê

De execução, os pacotes só pedem o que o app já tem (dependências "peer"): React 19, e no celular o React Native
(0.79 ou mais novo) e o `expo-clipboard`, que o `useClipboard` usa (`npx expo install expo-clipboard`). As de
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
| Testing Library + jsdom | testes de componente e de hook da web, como o usuário usa |
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
