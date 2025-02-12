import { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "@react-native-firebase/auth";

export const useSignIn = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const signIn = async (email: string, password: string) => {
    setLoading(true);

    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  return { signIn, loading };
};
