import { FC, useState } from "react";
import { IClient } from "@app/types";
import {
  ActivityIndicator,
  FlatList,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
} from "react-native";
import { CustomButton } from "@app/components";

interface ClientSelectionProps {
  clients: IClient[];
  selectedClientIds: string[];
  onSelectionChange: (clientIds: string[]) => void;
  isLoading?: boolean;
  multiSelect?: boolean;
  emptyMessage?: string;
  onAddClient?: () => void;
}

const ClientSelection: FC<ClientSelectionProps> = ({
  clients,
  selectedClientIds,
  onSelectionChange,
  onAddClient,
  isLoading = false,
  multiSelect = false,
  emptyMessage = "No clients found",
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = clients.filter((client) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      client.name.toLowerCase().includes(searchLower) ||
      client.surname.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower)
    );
  });

  const handleClientToggle = (clientId: string) => {
    if (multiSelect) {
      if (selectedClientIds.includes(clientId)) {
        onSelectionChange(selectedClientIds.filter((id) => id !== clientId));
      } else {
        onSelectionChange([...selectedClientIds, clientId]);
      }
    } else {
      onSelectionChange([clientId]);
    }
  };

  const isSelected = (clientId: string) => selectedClientIds.includes(clientId);

  const renderClient = ({ item }: { item: IClient }) => {
    const selected = isSelected(item.id!);

    return (
      <TouchableOpacity
        onPress={() => handleClientToggle(item.id!)}
        className={`
          p-4 mb-2 rounded-lg border-2
          ${
            selected
              ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500"
              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          }
        `}
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text
              className={`font-semibold text-base ${
                selected
                  ? "text-blue-700 dark:text-blue-300"
                  : "text-gray-900 dark:text-gray-100"
              }`}
            >
              {item.name} {item.surname}
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {item.email}
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-500 mt-0.5">
              {item.phone}
            </Text>
          </View>

          <View
            className={`
            px-3 py-1 rounded-full
            ${item.status === "active" && "bg-green-100 dark:bg-green-900/30"}
            ${item.status === "pending" && "bg-yellow-100 dark:bg-yellow-900/30"}
            ${item.status === "inactive" && "bg-gray-100 dark:bg-gray-700"}
          `}
          >
            <Text
              className={`text-xs font-medium
              ${item.status === "active" && "text-green-700 dark:text-green-300"}
              ${item.status === "pending" && "text-yellow-700 dark:text-yellow-300"}
              ${item.status === "inactive" && "text-gray-600 dark:text-gray-400"}
            `}
            >
              {item.status}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (clients.length === 0) {
    return (
      <View className={"flex-1 justify-center items-center"}>
        <CustomButton
          iconName={"plus"}
          title={"Dodaj Nowego Klienta"}
          onPress={onAddClient}
        ></CustomButton>
      </View>
    );
  }

  return (
    <FlatList
      data={filteredClients}
      renderItem={renderClient}
      keyExtractor={(item) => item.id!}
      contentContainerStyle={{ paddingBottom: 16 }}
      ListHeaderComponent={
        <>
          {/* Search */}
          <View className="px-4 pt-4 pb-2">
            <TextInput
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:text-white dark:border-gray-600 rounded-lg px-4 py-3"
              placeholder="Search clients..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Counter */}
          {multiSelect && selectedClientIds.length > 0 && (
            <View className="px-4 pb-2">
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                {selectedClientIds.length} selected
              </Text>
            </View>
          )}
        </>
      }
      ListFooterComponent={
        <View className="px-4 pt-4">
          <CustomButton
            iconName="plus"
            title="Dodaj Nowego Klienta"
            onPress={onAddClient}
          />
        </View>
      }
      ListEmptyComponent={
        <View className="justify-center items-center py-12">
          <Text className="text-gray-500 dark:text-gray-400 text-center">
            {searchQuery ? "Brak wyników" : emptyMessage}
          </Text>
        </View>
      }
    />
  );
};

export default ClientSelection;
