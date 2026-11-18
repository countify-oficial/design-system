---
"@countify-oficial/provider": minor
"@countify-oficial/core": minor
"@countify-oficial/native": minor
---

Announcement (web e celular): a novidade que fica na tela até a pessoa dispensar ("Nova versão do agente", "Agora dá para exportar em CSV"), para o rodapé do menu lateral ou o topo de uma tela. Cartão com o ícone no quadrado do tom (ThemeIcon), título, texto curto, uma ação opcional (Button ou Anchor) e o × "Dispensar". Funciona controlado (`opened`, `onDismiss`) ou não (`defaultOpened`); na web, `storageKey` lembra a dispensa no `localStorage`, e o foco vai para o próximo elemento focável ao dispensar. No provider, a mensagem `dismiss`.
