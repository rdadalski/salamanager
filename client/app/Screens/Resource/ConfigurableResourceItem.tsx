import type { FC } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  TextInput, // Będziemy potrzebować TextInput
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  useGetAllResourcesQuery,
  useUpdateResourceMutation, // Importujemy mutację
} from "@app/api/resource/resource.api";
import type { IResource } from "@app/types/resource";
import Ionicons from "react-native-vector-icons/MaterialIcons";
import { CustomButton } from "@app/components"; // Użyjemy Twojego CustomButton
import { useState } from "react";

type ItemProps = {
  resource: IResource;
};

const ConfigurableResourceItem: FC<ItemProps> = ({ resource }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [price, setPrice] = useState(String(resource.defaultPrice || "0"));

  const [updateResource, { isLoading: isSaving, error: updateError }] =
    useUpdateResourceMutation();

  const handleSave = async () => {
    const parsedPrice = parseFloat(price);

    console.log(resource);

    if (isNaN(parsedPrice) || parsedPrice < 0) {
      Alert.alert("Błąd", "Wprowadź poprawną cenę.");
      return;
    }

    try {
      await updateResource({
        id: resource.id!,
        values: {
          defaultPrice: parsedPrice,
          configured: true,
        },
      }).unwrap();

      Alert.alert("Sukces", "Trening został skonfigurowany.");
      setIsExpanded(false);
    } catch (err) {
      console.log(updateError);
      Alert.alert("Błąd", "Nie udało się zapisać zmian. Spróbuj ponownie.");
    }
  };

  return (
    <View className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-3 overflow-hidden">
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        className="p-4 flex-row items-center justify-between"
      >
        <View className="flex-1">
          <Text className="text-lg font-semibold dark:text-white">
            {resource.name}
          </Text>
          <Text className="text-sm text-yellow-600 dark:text-yellow-500">
            Wymaga konfiguracji
          </Text>
        </View>
        <Ionicons
          name={isExpanded ? "expand-less" : "expand-more"}
          size={24}
          className="text-gray-500 dark:text-gray-400"
        />
      </TouchableOpacity>

      {isExpanded && (
        <View className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Cena (zł)
          </Text>
          <TextInput
            value={price}
            onChangeText={setPrice}
            className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-base rounded-lg p-3 mb-4"
            placeholder="np. 100"
            keyboardType="numeric"
          />

          <CustomButton title="Zapisz" iconName={"save"} onPress={handleSave} />
        </View>
      )}
    </View>
  );
};

export default ConfigurableResourceItem;
