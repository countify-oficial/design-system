---
"@countify-oficial/core": patch
"@countify-oficial/native": patch
---

Notification: a ação (o Button subtle do "Desfazer") e o botão de fechar usam os tokens do outro modo, porque o fundo do aviso é invertido. No claro, o "Desfazer" fica no azul #8CBAF2 sobre o aviso escuro (7,2:1, antes 2,2:1); no escuro, no #225BA5 sobre o aviso claro (6,5:1, antes 1,9:1). No aviso vermelho (`color="down"`), a ação usa o texto do outro modo (6,3:1 e 7,7:1). Na web, `data-cf-color-scheme` com o modo inverso do provider; no celular, o contexto do tema com as cores do outro modo.
