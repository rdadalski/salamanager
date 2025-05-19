import { ComponentType, FC, useState } from "react";
import { Alert, Modal, Pressable, View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";

interface CustomModalProps<T = {}> {
  title?: string;
  component: ComponentType<T>;
  componentProps?: T;
  visible: boolean;
  onClose: () => void;
}

export const FullscreenModal = <T extends {}>({
  title,
  component: Component,
  componentProps,
  visible,
  onClose,
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
          {/* Modal Header */}
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

          {/* Modal Content */}
          <View className="flex-1 items-center justify-center p-4">
            <Component {...(componentProps as T)} />
          </View>
        </View>
      </Modal>

      {/*<Pressable*/}
      {/*  className="bg-purple-500 py-3 px-6 rounded-lg active:bg-purple-600 dark:bg-purple-600 dark:active:bg-purple-700"*/}
      {/*  onPress={() => setModalVisible(true)}*/}
      {/*>*/}
      {/*  <Text className="text-white font-bold text-center">*/}
      {/*    Show Fullscreen Modal*/}
      {/*  </Text>*/}
      {/*</Pressable>*/}
    </View>
  );
};
