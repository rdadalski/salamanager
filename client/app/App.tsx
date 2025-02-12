import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { store } from "./store";
import { RootNavigator } from "./navigation";
import { firebase } from "@react-native-firebase/app";

export default function App() {
  const [isUserSignedIn, setSignedIn] = useState<boolean>(false);

  useEffect(() => {
    const { token } = firebase.appCheck().getToken(true);
    console.log(token);
  }, []);

  return (
    <>
      <Provider store={store}>
        <StatusBar style="light"></StatusBar>
        <RootNavigator isSignedIn={isUserSignedIn} />
      </Provider>
    </>
  );
}
