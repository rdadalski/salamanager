import { getAuth } from "@react-native-firebase/auth";

export const useSignOut = () => {
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
