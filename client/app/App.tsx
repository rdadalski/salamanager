import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { RootNavigator } from "./navigation";

export default function App() {
  return (
    <>
      <Provider store={store}>
        <StatusBar style="light"></StatusBar>
        <RootNavigator />
      </Provider>
    </>
  );
}
