import { useState } from "react";
import { getAuth, FirebaseAuthTypes } from "@react-native-firebase/auth";

export const useSignUp = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const signUp = async (email: string, password: string) => {
    setLoading(true);

    try {
      const userCredential = await getAuth().createUserWithEmailAndPassword(
        email,
        password,
      );

      // Send email verification
      await userCredential.user.sendEmailVerification();

      await getAuth().signOut();

      return {
        success: true,
        message: "Verification email sent. Please check your inbox.",
      };
    } catch (error) {
      if ((error as FirebaseAuthTypes.NativeFirebaseAuthError).code) {
        const authError = error as FirebaseAuthTypes.NativeFirebaseAuthError;
        let errorMessage = "An error occurred during signup.";

        switch (authError.code) {
          case "auth/email-already-in-use":
            errorMessage = "This email is already registered.";
            break;
          case "auth/invalid-email":
            errorMessage = "Please enter a valid email address.";
            break;
          case "auth/operation-not-allowed":
            errorMessage = "Email/password accounts are not enabled.";
            break;
          case "auth/weak-password":
            errorMessage = "Please enter a stronger password.";
            break;
        }

        return {
          success: false,
          message: errorMessage,
          error: error,
        };
      }

      return {
        success: false as const,
        message: "An unexpected error occurred",
        error: new Error("Unknown error during signup"),
      };
    }
  };

  return { signUp, loading };
};
