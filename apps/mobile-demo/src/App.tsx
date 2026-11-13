// um caminho por peso: só os cinco que os tokens usam entram no app (o índice do pacote traz todos)
import { Roboto_400Regular } from "@expo-google-fonts/roboto/400Regular";
import { Roboto_500Medium } from "@expo-google-fonts/roboto/500Medium";
import { Roboto_700Bold } from "@expo-google-fonts/roboto/700Bold";
import { RobotoMono_400Regular } from "@expo-google-fonts/roboto-mono/400Regular";
import { RobotoMono_500Medium } from "@expo-google-fonts/roboto-mono/500Medium";
import { CountifyProvider } from "@countify-oficial/provider";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { Galeria } from "./Galeria";

function ComMargens() {
  const insets = useSafeAreaInsets();
  return <Galeria insets={{ top: insets.top, bottom: insets.bottom }} />;
}

/** A galeria do celular: carrega a Roboto (os nomes que os tokens usam) e as margens do sistema. */
export function App() {
  const [prontas] = useFonts({ Roboto_400Regular, Roboto_500Medium, Roboto_700Bold, RobotoMono_400Regular, RobotoMono_500Medium });
  if (!prontas) return null;
  return (
    <SafeAreaProvider>
      <CountifyProvider>
        <StatusBar style="auto" />
        <ComMargens />
      </CountifyProvider>
    </SafeAreaProvider>
  );
}
