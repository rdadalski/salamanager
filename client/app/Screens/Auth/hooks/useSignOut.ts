import { getAuth } from "@react-native-firebase/auth";
import { useState } from "react";

export const useSignOut = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const signOut = () => {
    getAuth()
      .signOut()
      .then((res) => {
        // Sign-out successful.
        console.log(res);
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };

  return { signOut, loading };
};
