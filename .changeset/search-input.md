---
"@countify-oficial/provider": minor
"@countify-oficial/core": minor
"@countify-oficial/native": minor
---

SearchInput (web e celular): o campo de busca do mockup ("Busca no topo da lista"), com a lupa à esquerda, o × para limpar quando há texto e `onSearch` com `debounce` opcional. Na web, `type="search"` com `role="searchbox"`, Esc limpa e `shortcut` ("/" ou "mod+K") leva o foco ao campo, mostrado num Kbd enquanto vazio; no celular, sem atalho nem Esc. Mensagem nova no provider: `clearSearch` ("Limpar busca").
