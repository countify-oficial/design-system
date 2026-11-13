# countify-ui

Biblioteca de componentes da Countify para **web (React), Electron e React Native**, com a identidade visual da
Countify e API própria. Monorepo pnpm + Turborepo, TypeScript estrito.

## Pacotes

| Pacote | O que tem | Situação |
|---|---|---|
| `@countify/tokens` | cores (escalas de 10 tons e papéis por modo), letra, espaço, cantos, tamanhos xs–xl, sombras, camadas, movimento, pontos de quebra; em TS, variáveis CSS e objeto para React Native | pronto (0.1.0) |
| `@countify/tsconfig`, `@countify/eslint-config` | configurações compartilhadas (privados, não publicados) | pronto |
| `@countify/hooks`, `@countify/core`, `@countify/native` e os pacotes de extensão | componentes e hooks | próximos passos |

A origem de cada token está em [docs/TOKENS_COUNTIFY.md](docs/TOKENS_COUNTIFY.md); a organização do repositório em
[docs/ARQUITETURA.md](docs/ARQUITETURA.md); como contribuir em [docs/CONTRIBUINDO.md](docs/CONTRIBUINDO.md).
A versão anterior (`@countify/ui` 0.1.0, pacote único) está em `legacy/ui/`, só como referência.

## Usar os tokens

```ts
import { colors, palette, spacing } from "@countify/tokens";   // TS
import "@countify/tokens/tokens.css";                           // web: variáveis --cf-*
import { nativeTokens } from "@countify/tokens";               // React Native
```

Na web, o modo segue o sistema; `data-cf-color-scheme="dark"` (ou `"light"`) num elemento força o modo dele para baixo.

## Desenvolver

Node 24.11 ou mais novo. O pnpm vem pelo corepack do Node, na versão fixada no `package.json`:

```bash
corepack enable pnpm   # uma vez por máquina
pnpm install
pnpm check             # build, tipos, lint e testes de todos os pacotes
```

## Dependências e por quê

Nenhum pacote publicado tem dependência de execução até agora. As de desenvolvimento:

| Dependência | Por quê |
|---|---|
| pnpm (workspaces) | um repositório com vários pacotes que dependem uns dos outros, sem cópia de `node_modules` |
| Turborepo | roda build, tipos, lint e testes na ordem das dependências e guarda o resultado do que não mudou |
| TypeScript 6.0 | o 7.0 ainda não tem a API em JavaScript que o typescript-eslint e a geração de `.d.ts` usam |
| tsup | gera ESM, CJS e `.d.ts` de cada pacote num comando |
| Changesets | versão e CHANGELOG por pacote a cada mudança, e a publicação |
| Vitest | testes rápidos em TS, sem configuração |
| ESLint 9 + typescript-eslint | regras com tipos; ESLint 9 porque o plugin de acessibilidade (jsx-a11y), que vem com os componentes, ainda não aceita o 10 |

Dependências de execução previstas na especificação (`@floating-ui`, react-aria ou Radix, react-native-reanimated,
react-native-gesture-handler) entram nesta tabela, com o motivo, quando o primeiro componente precisar delas.

## Publicar

`pnpm changeset` a cada mudança; `pnpm version-packages` aplica as versões; `pnpm release` publica com acesso restrito.
**Falta definir o registry privado** (GitHub Packages, Verdaccio ou outro): o endereço vai num `.npmrc` com
`@countify:registry=<url>`.
