import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { RootNavigator } from "./navigation";
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
        <StatusBar style="light"></StatusBar>
        <RootNavigator />
      </Provider>
    </>
  );
}
