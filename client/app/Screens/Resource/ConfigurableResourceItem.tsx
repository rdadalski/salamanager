import type { FC } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import type { IResource } from "@app/types/resource";
import Ionicons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CalendarStackParamList } from "@app/navigation/CalendarNavigation";

type ItemProps = {
  resource: IResource;
};

const ConfigurableResourceItem: FC<ItemProps> = ({ resource }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CalendarStackParamList>>();

  const onPress = () => {
    navigation.navigate("ResourceEditScreen", { resourceId: resource.id! });
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-3 overflow-hidden p-4 flex-row items-center justify-between"
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
        name={"arrow-right"}
        size={24}
        className="text-gray-500 dark:text-gray-400"
      />
    </TouchableOpacity>
  );
};

export default ConfigurableResourceItem;
