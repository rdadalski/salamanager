import { FC, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { HomeStackParamList } from "../navigation";
import { SignOutButton } from "./Auth/components/SignOutButton";

export const HomeScreen: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const onPress = () => {
    navigation.navigate("Notifications");
  };

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="font-bold pb-2 text-2xl">Welcome to Home Screen</Text>
      <Pressable onPress={onPress} className="h-10 mb-4">
        <View className="rounded-lg justify-center items-center bg-black">
          <Text className="font-bold text-white p-2">
            Go to notification screen
          </Text>
        </View>
      </Pressable>
      {/*<Text className="font-mono text-sm text-gray-800 bg-gray-200 p-2 rounded">{Response}</Text>*/}
    </View>
  );
};
