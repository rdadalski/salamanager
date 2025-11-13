import type { FC } from "react";
import { Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

interface ICustomButton {
  title: string;
  iconName: string;
  onPress?: () => void;
  loading?: boolean;
}

export const CustomButton: FC<ICustomButton> = ({
  title,
  iconName,
  onPress,
  loading,
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        console.log("tap tap tap");
        if (onPress) {
          onPress();
        }
      }}
      // disabled={loading}
    >
      <View
        className={`
          flex-row justify-center items-center bg-blue-700 
          rounded-lg shadow-sm 
          px-4 py-3 
        `}
      >
        {loading ? (
          <ActivityIndicator color={"#fff"} size="small" />
        ) : (
          <>
            {title !== "" && (
              <Text className="font-bold text-white text-base mr-2">
                {title.toUpperCase()}
              </Text>
            )}
            <AntDesign color={"#fff"} size={16} name={iconName} />
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};
