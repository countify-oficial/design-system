# Contribuindo

1. `pnpm install` e `pnpm check` antes de começar e antes de abrir o PR: build, tipos, lint e testes de tudo.
2. Toda mudança que um app sente leva um changeset: `pnpm changeset`, uma linha em pt-BR.
3. Identificadores em inglês (D-12 do Countify); textos de interface, comentários e documentação em pt-BR.

## Tokens

- **Valor visual só em `@countify-oficial/tokens`.** Hex, px de medida, fonte ou duração em outro pacote é erro.
- **Valor novo precisa de origem.** Ou vem da identidade (guia, mockup, cores.py, marca) ou de uma proposta aprovada
  pelo dono do projeto; nos dois casos, entra em `docs/TOKENS_COUNTIFY.md` com a fonte.
- **Contraste**: texto 4,5:1 nos dois modos. O teste do pacote confere todos os papéis; um papel novo de texto entra
  na lista do teste.
- Quando o guia e o mockup divergem, vale o mockup (a referência visual do Countify).

## Componentes

Cada componente chega com tudo isto (é o que a especificação pede):

1. Implementação em `packages/core/src/<Nome>/` (web) e, quando existe no celular, em `packages/native/src/<Nome>/`.
2. Tipos exportados no `src/index.ts`, com um comentário em cada prop: vira a tabela de props do Storybook.
3. CSS Module (web) só com variáveis `--cf-*`.
4. Testes: Testing Library (web) com a checagem do axe (`semViolacoes`), e React Native Testing Library (celular).
5. História em `apps/docs/stories/<Nome>.stories.tsx` com todas as variantes, tamanhos e estados.
6. Uma linha na `MATRIZ_COMPONENTES.md`: ok, adaptado ou N/A nas três plataformas, com o motivo.
