import { useGetAllResourcesQuery } from "@app/api/resource/resource.api";
import { FC } from "react";
import {
  ActivityIndicator,
  FlatList,
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/MaterialIcons";
import ConfigurableResourceItem from "@app/Screens/Resource/ConfigurableResourceItem";

const ConfigureResourcesScreen: FC = () => {
  const { data: resources, isLoading, isError } = useGetAllResourcesQuery();

  const unconfigured = resources?.filter((r) => !r.configured) || [];

  const renderContent = () => {
    if (isLoading) {
      return (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
        </View>
      );
    }

    if (isError) {
      return (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-red-500 text-center">
            Wystąpił błąd podczas ładowania zasobów.
          </Text>
        </View>
      );
    }

    if (unconfigured.length === 0) {
      return (
        <View className="flex-1 justify-center items-center p-4">
          <Ionicons
            name="check-circle-outline"
            size={48}
            className="text-green-500 mb-4" // Poprawiony kolor ikony
          />
          <Text className="text-lg font-semibold dark:text-white text-center">
            Wszystko gotowe!
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 text-center">
            Wszystkie Twoje treningi są poprawnie skonfigurowane.
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={unconfigured}
        keyExtractor={(item) => item.id!}
        renderItem={({ item }) => <ConfigurableResourceItem resource={item} />}
        contentContainerClassName="p-4"
      />
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Text className="text-2xl font-bold dark:text-white">
            Skonfiguruj treningi
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 mt-1">
            Ustaw ceny i limity miejsc dla swoich zajęć.
          </Text>
        </View>
        {renderContent()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ConfigureResourcesScreen;
