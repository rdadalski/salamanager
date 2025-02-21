import { FC } from "react";
import { useSignOut } from "../hooks";
import { Pressable, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/AntDesign";

export const SignOutButton: FC = () => {
  const { signOut, loading } = useSignOut();

  return (
    <Pressable onPress={signOut} className="h-10 mb-4">
      <View className=" px-4 flex-row justify-center items-center bg-black">
        <Text className="font-bold text-white p-2">Sign Out</Text>
        <Ionicons color={"#fff"} size={16} name="logout" />
      </View>
    </Pressable>
  );
};
