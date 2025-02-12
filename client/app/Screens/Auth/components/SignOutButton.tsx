import { FC } from "react";
import { useSignOut } from "../hooks";
import { Button } from "react-native";

export const SignOutButton: FC = () => {
  const { signOut, loading } = useSignOut();

  return <Button title={"Sign Out"} onPress={signOut}></Button>;
};
