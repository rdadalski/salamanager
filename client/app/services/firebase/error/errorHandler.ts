import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { ErrorMessage } from "./types";
import { defaultError, firebaseErrorMap } from "./errorMap";

export class FirebaseErrorHandler {
  public static handleError(
    error: FirebaseAuthTypes.NativeFirebaseAuthError,
  ): ErrorMessage {
    // TODO
    //  we can add more explicit error handling later
    //  maybe some kind of logger, error database

    console.error("Firebase Auth Error:", {
      code: error.code,
      message: error.message,
      nativeErrorMessage: error.nativeErrorMessage,
    });

    return firebaseErrorMap[error.code] || defaultError;
  }

  public static getUserMessage(
    error: FirebaseAuthTypes.NativeFirebaseAuthError,
  ): string {
    return this.handleError(error).userMessage;
  }

  public static isNetworkError(
    error: FirebaseAuthTypes.NativeFirebaseAuthError,
  ): boolean {
    return error.code === "auth/network-request-failed";
  }
}
