import { FC } from "react";
import { View, Text, Pressable } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { HomeStackParamList } from "../navigation";
import { FullscreenModal } from "@app/components/CustomModal";
import { ResourceForm } from "@app/forms/ResourceForm";

export const HomeScreen: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const onPress = () => {
    navigation.navigate("Notifications");
  };

  const handleCalendar = () => {
    navigation.navigate("Calendar");
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
      <Pressable onPress={handleCalendar} className="h-10 mb-4">
        <View className="rounded-lg justify-center items-center bg-black">
          <Text className="font-bold text-white p-2">
            Go to calendar screen
          </Text>
        </View>
      </Pressable>
    </View>
  );
};
