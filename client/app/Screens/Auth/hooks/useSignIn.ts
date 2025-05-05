import { useState } from "react";
import { FirebaseAuthTypes, getAuth } from "@react-native-firebase/auth";
import { FirebaseErrorHandler } from "@app/services";
import { defaultError } from "@app/services/firebase/error/errorMap";
import { storeToken } from "@app/services/storage/asyncStorage";

export const useSignIn = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const getTokenId = async (user: FirebaseAuthTypes.User) => {
    const userToken = await user.getIdToken(true);
    await storeToken(userToken);
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);

    try {
      const userCredential = await getAuth().signInWithEmailAndPassword(
        email,
        password,
      );

      const user = userCredential.user;
      await getTokenId(user);

      return {
        success: true,
        message: "Sign in successfull",
      };

      // TODO store user credentials
    } catch (error) {
      if ((error as FirebaseAuthTypes.NativeFirebaseAuthError).code) {
        const authError = error as FirebaseAuthTypes.NativeFirebaseAuthError;
        let errorMessage = FirebaseErrorHandler.handleError(authError);

        return {
          success: false,
          message: errorMessage.userMessage,
          error: error,
        };
      }

      return defaultError;
    }
  };

  return { signIn, loading };
};
