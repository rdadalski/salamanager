import { useState } from "react";
import { getAuth } from "@react-native-firebase/auth";

export const useSignUp = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const signUp = async (email: string, password: string) => {
    setLoading(true);

    getAuth()
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        console.log(res);
        // TODO store user credentials
        console.log("User account created & signed in!");
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          console.log("That email address is already in use!");
        }

        if (error.code === "auth/invalid-email") {
          console.log("That email address is invalid!");
        }

        console.error(error);
      });
  };

  return { signUp, loading };
};
