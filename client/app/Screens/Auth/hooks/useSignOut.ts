import { getAuth } from "@react-native-firebase/auth";
import { useState } from "react";
import { clearStorage } from "@app/services/storage/asyncStorage";

export const useSignOut = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const signOut = async () => {
    await getAuth().signOut();
    await clearStorage();
  };

  return { signOut, loading };
};
