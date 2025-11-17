import { ComponentType, ReactNode } from "react";
import { Modal, Pressable, View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";

interface CustomModalProps<T = {}> {
  title?: string;
  component: ComponentType<T>;
  componentProps?: T;
  visible: boolean;
  onClose: () => void;
  footer?: ReactNode;
}

export const FullscreenModal = <T extends {}>({
  title,
  component: Component,
  componentProps,
  visible,
  onClose,
  footer,
}: CustomModalProps<T>) => {
  const { colorScheme } = useColorScheme();

  return (
    <View className="">
      <StatusBar style="auto" />

      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        statusBarTranslucent={true}
        onRequestClose={() => {
          onClose();
        }}
      >
        <View className="flex-1 bg-white dark:bg-gray-900">
          <View className="pt-12 pb-4 px-4 bg-blue-500 dark:bg-blue-700 flex-row justify-between items-center">
            <Text className="text-white text-xl font-bold">{title}</Text>
            <Pressable
              className="bg-red-500 py-3 px-6 rounded-lg active:bg-red-600 dark:bg-red-600 dark:active:bg-red-700"
              onPress={onClose}
            >
              <Text className="text-white font-bold text-center">
                Close Modal
              </Text>
            </Pressable>
          </View>

          <View className="flex-1 ">
            <Component {...(componentProps as T)} />
          </View>

          {footer && (
            <View className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
              {footer}
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};
