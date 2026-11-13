import { setStringAsync } from "expo-clipboard";
import { createUseClipboard } from "./clipboard";

/** nativo: copia com o expo-clipboard (o app instala com `npx expo install expo-clipboard`). */
export const useClipboard = createUseClipboard(setStringAsync);
