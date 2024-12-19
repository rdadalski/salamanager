import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";

interface CustomButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  containerStyles: string;
  textStyles: string;
  isLoading: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-secondary-100 rounded-xl justify-center items-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
    >
      <Text
        className={`text-primary font-psemibold text-lg px-2 py-4 ${textStyles}`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
