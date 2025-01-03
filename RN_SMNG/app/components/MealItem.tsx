import { FC } from "react";
import { View, Text, Pressable, Image, Platform } from "react-native";

interface IMealItemProps {
  title: string;
  imageUri: string;
  duration: number;
  complexity: string;
  affordability: string;
}

const MealItem: FC<IMealItemProps> = ({
  title,
  imageUri,
  duration,
  complexity,
  affordability,
}): JSX.Element => {
  return (
    <View
      className="m-4 bg-white rounded-lg shadow shadow-black"
      style={{ overflow: Platform.OS === "android" ? "hidden" : "visible" }}
    >
      <Pressable
        style={({ pressed }) => (pressed ? { opacity: 0.5 } : null)}
        android_ripple={{ color: "#ccc" }}
      >
        <View className="overflow-hidden">
          <View>
            <Image
              className="w-full h-64 "
              source={{ uri: imageUri }}
            ></Image>
            <Text className="text-center font-bold">{title}</Text>
          </View>
          <View className="flex-row items-center justify-center w-full p-2">
            <Text className="mx-2 text-xs">{duration}</Text>
            <Text className="mx-2 text-xs">{complexity.toUpperCase()}</Text>
            <Text className="mx-2 text-xs">{affordability.toUpperCase()}</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default MealItem;
