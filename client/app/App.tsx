import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { store } from "./store";
import { RootNavigator } from "./navigation";

export default function App() {
  const [isUserSignedIn, setSignedIn] = useState<boolean>(false);

  return (
    <>
      <Provider store={store}>
        <StatusBar style="light"></StatusBar>
        <RootNavigator isSignedIn={isUserSignedIn} />
      </Provider>
    </>
  );
}
