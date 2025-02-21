import { ErrorMessage } from "./types";

export const firebaseErrorMap: Record<string, ErrorMessage> = {
  "auth/invalid-email": {
    code: "auth/invalid-email",
    message: "Email address is not properly formatted",
    userMessage: "Please enter a valid email address",
  },
  "auth/user-disabled": {
    code: "auth/user-disabled",
    message: "User account has been disabled",
    userMessage: "Your account has been disabled. Please contact support",
  },
  "auth/user-not-found": {
    code: "auth/user-not-found",
    message: "No user found with this email",
    userMessage: "No account found with this email",
  },
  "auth/wrong-password": {
    code: "auth/wrong-password",
    message: "Password is invalid",
    userMessage: "Incorrect password",
  },
  "auth/too-many-requests": {
    code: "auth/too-many-requests",
    message: "Too many unsuccessful attempts",
    userMessage: "Too many failed attempts. Please try again later",
  },
  "auth/network-request-failed": {
    code: "auth/network-request-failed",
    message: "Network error occurred",
    userMessage: "Please check your internet connection",
  },
};

export const defaultError: ErrorMessage = {
  code: "unknown",
  message: "An unknown error occurred",
  userMessage: "Something went wrong. Please try again",
};
