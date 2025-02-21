import { useState } from "react";
import { getAuth, FirebaseAuthTypes } from "@react-native-firebase/auth";
import { FirebaseErrorHandler } from "@app/services";
import { defaultError } from "@app/services/firebase/error/errorMap";

export const useSignUp = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const signUp = async (email: string, password: string) => {
    setLoading(true);

    try {
      const userCredential = await getAuth().createUserWithEmailAndPassword(
        email,
        password,
      );

      console.log(userCredential);

      await userCredential.user.sendEmailVerification();
      await getAuth().signOut();

      return {
        success: true,
        message: "Verification email sent. Please check your inbox.",
      };
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

  return { signUp, loading };
};
