import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, Pressable } from "react-native";

interface ICategoriesGridTileProps {
  title: string;
  color: string;
  onPress: () => void;
}

const CategoriesGridTile: React.FC<ICategoriesGridTileProps> = ({ title, color, onPress }) => {
  const navigation = useNavigation();

  return (
    <View
      style={{ backgroundColor: color }}
      className="flex-1 m-4 h-[150px] bg-white rounded-lg shadow shadow-black"
    >
      <Pressable
        onPress={onPress}
        android_ripple={{ color: "#fff" }}
        className="flex-1"
        style={({ pressed }) => (pressed ? { opacity: 0.5 } : null)}
      >
        <View className="flex-1 rounded-lg justify-center items-center">
          <Text className="font-bold">{title}</Text>
        </View>
      </Pressable>
    </View>
  );
};

export default CategoriesGridTile;
