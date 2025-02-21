import { useLazyGetGoogleApiKeyQuery } from "@app/api/config";
import { useEffect, useState } from "react";
import { FirebaseAuthTypes, getAuth } from "@react-native-firebase/auth";

export const useInitializeApp = () => {
  const [isUserSignedIn, setSignedIn] = useState<boolean>(false);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User>();

  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    if (user) {
      setUser(user as FirebaseAuthTypes.User);
      setSignedIn(true);
    } else {
      setSignedIn(false);
    }

    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    console.log("Auth State changed");
    const subscriber = getAuth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  return { isUserSignedIn, user, initializing };
};
