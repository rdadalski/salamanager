import { getAuth, firebase } from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { ErrorMessage, storeToken } from "@app/services";
import { useCreateUserMutation } from "@app/api/users/usersApi";

export const useGoogleSignIn = () => {
  const [createUser] = useCreateUserMutation();

  const signInWithGoogle = async (webClientId: string) => {
    try {
      await configureGoogle(webClientId);

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const signInResult = await GoogleSignin.signIn();

      const { accessToken, idToken } = await GoogleSignin.getTokens();
      await storeToken(idToken);

      if (!idToken) {
        throw new Error("No ID token found");
      }

      const credential = firebase.auth.GoogleAuthProvider.credential(
        idToken,
        accessToken,
      );

      const userCredentials = await getAuth().signInWithCredential(credential);
      const isNewUser = userCredentials.additionalUserInfo?.isNewUser || false;

      if (isNewUser) {
        await userCredentials.user.sendEmailVerification();
        const firebaseUser = await createUser(userCredentials.user);
      }

      return userCredentials;
    } catch (e) {
      const error = e as ErrorMessage;
      console.log(error);
      return error.message;
    }
  };

  const configureGoogle = async (webClientId: string) => {
    GoogleSignin.configure({
      webClientId: webClientId as string, // this is crucial
      offlineAccess: true, // include this
      scopes: ["openid"], // make sure you have this
    });
  };

  return { signInWithGoogle };
};
