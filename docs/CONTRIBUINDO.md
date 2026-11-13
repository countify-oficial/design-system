# Contribuindo

1. `pnpm install` e `pnpm check` antes de começar e antes de abrir o PR: build, tipos, lint e testes de tudo.
2. Toda mudança que um app sente leva um changeset: `pnpm changeset`, uma linha em pt-BR.
3. Identificadores em inglês (D-12 do Countify); textos de interface, comentários e documentação em pt-BR.

## Tokens

- **Valor visual só em `@countify/tokens`.** Hex, px de medida, fonte ou duração em outro pacote é erro.
- **Valor novo precisa de origem.** Ou vem da identidade (guia, mockup, cores.py, marca) ou de uma proposta aprovada
  pelo dono do projeto; nos dois casos, entra em `docs/TOKENS_COUNTIFY.md` com a fonte.
- **Contraste**: texto 4,5:1 nos dois modos. O teste do pacote confere todos os papéis; um papel novo de texto entra
  na lista do teste.
- Quando o guia e o mockup divergem, vale o mockup (a referência visual do Countify).
