import auth, { getAuth } from "@react-native-firebase/auth";
import { getApp } from "@react-native-firebase/app";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { ErrorMessage } from "@app/services";

export const useGoogleSignIn = () => {
  const signInWithGoogle = async (webClientId: string) => {
    try {
      await configureGoogle(webClientId);

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const signInResult = await GoogleSignin.signIn();

      const { accessToken, idToken } = await GoogleSignin.getTokens();

      console.log(accessToken, idToken);

      if (!idToken) {
        throw new Error("No ID token found");
      }

      const credential = auth.GoogleAuthProvider.credential(
        idToken,
        accessToken,
      );

      return await getAuth().signInWithCredential(credential);
    } catch (e) {
      const error = e as ErrorMessage;
      console.log(error);
      return error.message;
    }
  };

  const configureGoogle = async (webClientId: string) => {
    console.log(webClientId);

    GoogleSignin.configure({
      webClientId: webClientId as string, // this is crucial
      offlineAccess: true, // include this
      scopes: ["openid"], // make sure you have this
    });
  };

  return { signInWithGoogle };
};
