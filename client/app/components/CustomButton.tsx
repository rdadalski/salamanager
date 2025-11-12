import { FC } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

interface ICustomButton {
  title: string;
  iconName: string;
  onPress?: () => void;
}

export const CustomButton: FC<ICustomButton> = ({
  title,
  iconName,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="px-2 py-1 flex-row justify-center items-center bg-blue-700">
        {title !== "" && (
          <Text className="font-bold text-white p-2">
            {title.toUpperCase()}
          </Text>
        )}

        <AntDesign color={"#fff"} size={16} name={iconName} />
      </View>
    </TouchableOpacity>
  );
};
