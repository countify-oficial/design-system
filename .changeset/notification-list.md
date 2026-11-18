---
"@countify-oficial/provider": minor
"@countify-oficial/core": minor
"@countify-oficial/native": minor
---

NotificationList (web e celular): a lista dos Avisos (mockups W-Avisos e M-Avisos), agrupada por dia ("hoje", "ontem", "12 de novembro"), cada aviso com ícone ou iniciais, título, loja e a hora em `<time>`; o escolhido fica em destaque (`selected`, `onSelect`), o não lido em negrito com um ponto, e há os estados vazio (EmptyState) e carregando (SkeletonLoader). Na web, uma parada no Tab e as setas andam entre os avisos. O NavLink do celular aceita `accessibilityLabel`. No provider, `groupByDay` e as mensagens `yesterday`, `unread` e `noNotifications`.
