import {
  getAuth,
  firebase,
  FirebaseAuthTypes,
} from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  ErrorMessage,
  storeGoogleAccessToken,
  storeToken,
} from "@app/services";
import { useCreateUserMutation } from "@app/api/users/usersApi";
import { IFirestoreUserData, UserRole } from "@app/types";

export const useGoogleSignIn = () => {
  const [createUser] = useCreateUserMutation();

  const getUserRequestData = (
    user: FirebaseAuthTypes.User,
  ): IFirestoreUserData => {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      phoneNumber: user.phoneNumber,
      metadata: {
        creationTime: user.metadata.creationTime,
        lastSignInTime: user.metadata.lastSignInTime,
      },
      role: UserRole.CLIENT,
    };
  };

  // Usage in your function

  const signInWithGoogle = async (webClientId: string, scopes: string[]) => {
    try {
      await configureGoogle(webClientId, scopes);

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const signInResult = await GoogleSignin.signIn();

      // await GoogleSignin.revokeAccess();
      // // Then sign out
      // await GoogleSignin.signOut();
      //
      // return null;

      const serverAuthCode = signInResult.data?.serverAuthCode;

      const { accessToken, idToken } = await GoogleSignin.getTokens();

      await storeGoogleAccessToken(accessToken);

      if (!idToken) {
        throw new Error("No ID token found");
      }

      const credential = firebase.auth.GoogleAuthProvider.credential(
        idToken,
        accessToken,
      );

      const userCredentials = await getAuth().signInWithCredential(credential);

      const firebaseAccessToken = await userCredentials.user.getIdToken();

      await storeToken(firebaseAccessToken);

      const isNewUser = userCredentials.additionalUserInfo?.isNewUser || false;

      if (isNewUser) {
        await userCredentials.user.sendEmailVerification();

        const createUserRequestData = {
          ...getUserRequestData(userCredentials.user),
          serverAuthCode: serverAuthCode as string,
        };
        const firebaseUser = await createUser(createUserRequestData);
      }

      return userCredentials;
    } catch (e) {
      const error = e as ErrorMessage;
      console.log(error);
      return error.message;
    }
  };

  const configureGoogle = async (webClientId: string, scopes: string[]) => {
    GoogleSignin.configure({
      webClientId: webClientId as string,
      offlineAccess: true,
      scopes: scopes,
    });
  };

  return { signInWithGoogle };
};
