import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { store } from "./store";
import { RootNavigator } from "./navigation";
import { getAuth } from "@react-native-firebase/auth";
import { useSignIn } from "./Screens/Auth";

export default function App() {
  const [isUserSignedIn, setSignedIn] = useState<boolean>(false);

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const {} = useSignIn();

  // Handle user state changes
  // TODO fix type

  function onAuthStateChanged(user: any) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = getAuth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  return (
    <>
      <Provider store={store}>
        <StatusBar style="light"></StatusBar>
        <RootNavigator isSignedIn={isUserSignedIn} />
      </Provider>
    </>
  );
}
