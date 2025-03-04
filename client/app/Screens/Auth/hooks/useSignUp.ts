import { useState } from "react";
import { FirebaseAuthTypes, getAuth } from "@react-native-firebase/auth";
import { FirebaseErrorHandler } from "@app/services";
import { defaultError } from "@app/services/firebase/error/errorMap";
import { useCreateUserMutation } from "@app/api/users/usersApi";

export const useSignUp = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [createUser] = useCreateUserMutation();

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userCredentials = await getAuth().createUserWithEmailAndPassword(
        email,
        password,
      );

      const firebaseUser = await createUser(userCredentials.user);

      await userCredentials.user.sendEmailVerification();

      await getAuth().signOut();

      setLoading(false);

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
