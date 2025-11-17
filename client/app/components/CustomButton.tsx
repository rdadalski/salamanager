import type { FC } from "react";
import { Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

interface ICustomButton {
  title: string;
  iconName?: string;
  onPress?: () => void;
  loading?: boolean;
  variant?: "primary" | "secondary" | "success" | "danger" | "warning";
  disabled?: boolean;
}

const VARIANT_STYLES = {
  primary:
    "bg-green-900 dark:bg-blue-800 active:bg-blue-700 dark:active:bg-blue-600",
  secondary:
    "bg-gray-600 dark:bg-gray-500 active:bg-gray-700 dark:active:bg-gray-600",
  success:
    "bg-green-600 dark:bg-green-500 active:bg-green-700 dark:active:bg-green-600",
  danger: "bg-red-600 dark:bg-red-500 active:bg-red-700 dark:active:bg-red-600",
  warning:
    "bg-yellow-600 dark:bg-yellow-500 active:bg-yellow-700 dark:active:bg-yellow-600",
};

export const CustomButton: FC<ICustomButton> = ({
  title,
  iconName,
  onPress,
  loading = false,
  variant = "primary",
  disabled = false,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      className={`
        ${VARIANT_STYLES[variant]}
        ${isDisabled && "opacity-50"}
      `}
    >
      <View
        className={
          "flex-row justify-center items-center rounded-lg shadow-sm px-4 py-3"
        }
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <>
            {title && (
              <Text className="font-bold text-white text-base mr-2">
                {title.toUpperCase()}
              </Text>
            )}
            {iconName && <AntDesign color="#fff" size={16} name={iconName} />}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};
