import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { RootNavigator } from "./navigation";
import { useColorScheme } from "nativewind";
import { colorScheme } from "nativewind";
import { useColorScheme as useDeviceColorScheme } from "react-native";
import { useEffect } from "react";
import { initializeNotifications } from "@app/services/notifications";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

export default function App() {
  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false, // Disable strict mode
  });

  const { setColorScheme } = useColorScheme();
  const deviceColorScheme = useDeviceColorScheme();

  useEffect(() => {
    if (deviceColorScheme) {
      setColorScheme(deviceColorScheme);
      colorScheme.set(deviceColorScheme);
    }
  }, [deviceColorScheme]);

  useEffect(() => {
    const setupNotifications = async () => {
      try {
        const initialized = await initializeNotifications();
      } catch (error) {
        console.error("Failed to initialize notifications:", error);
      }
    };

    setupNotifications();
  }, []);

  return (
    <>
      <Provider store={store}>
        <StatusBar style={deviceColorScheme!}></StatusBar>
        <RootNavigator />
      </Provider>
    </>
  );
}
