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

## Componentes

Entram aqui a partir do passo 3 (primitivos).
