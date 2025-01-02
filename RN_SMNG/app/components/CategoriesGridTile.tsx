import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from "react-native";

interface CategoriesGridTileProps {
  title: string;
  color: string;
  onPress: () => void;
}

const CategoriesGridTile: React.FC<CategoriesGridTileProps> = ({
  title,
  color,
  onPress,
}) => {
  return (
    <View
      style={{ backgroundColor: color }}
      className="flex-1 m-4 h-[150px] bg-white rounded-lg shadow shadow-black"
    >
      <Pressable
        onPress={onPress}
        android_ripple={{ color: "#fff" }}
        className="flex-1"
      >
        <View className="flex-1 rounded-lg justify-center items-center">
          <Text className="font-bold">{title}</Text>
        </View>
      </Pressable>
    </View>
  );
};

export default CategoriesGridTile;
