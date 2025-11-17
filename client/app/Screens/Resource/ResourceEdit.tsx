import { FC, useEffect, useState } from "react";

import {
  Pressable,
  ScrollView,
  TextInput,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { FullscreenModal } from "@app/components/CustomModal";
import ClientSelection from "@app/Screens/Clients/ClientSelection";

import ClientForm from "@app/Screens/Clients/ClientForm";
import { CustomButton } from "@app/components";
import useResourceEdit from "@app/Screens/Resource/useResourceEdit";
import { useUpdateResourceMutation } from "@app/api/resource/resource.api";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCreateClientMutation } from "@app/api/clients/clientsApi";
import { CreateClientDto } from "@app/types";

const ResourceEdit: FC = () => {
  const {
    resource,
    clients,
    clientsIsLoading,
    price,
    setPrice,
    loadingResource,
    assignedClients,
    setAssignedClients,
  } = useResourceEdit();

  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
  const [isClientModalVisible, setIsClientModalVisible] = useState(false);
  const [isAddClientModalVisible, setIsAddClientModalVisible] = useState(false);

  const handleClientSelectionCloseModal = () => {
    setIsClientModalVisible(false);
    setAssignedClients((prev) => {
      return Array.from(new Set([...prev, ...selectedClientIds]));
    });
  };

  const [updateResource, { isLoading: updateResourceIsLoading }] =
    useUpdateResourceMutation();

  const [createNewClient] = useCreateClientMutation();

  const handleAddClient = async (formData: CreateClientDto) => {
    await createNewClient(formData).unwrap();
    setIsAddClientModalVisible(false);
  };

  const handleUpdateResource = async () => {
    if (!resource) return;

    console.log(resource);

    try {
      const res = await updateResource({
        id: resource.id!,
        values: { defaultPrice: +price, clients: assignedClients },
      });

      console.log(res);
    } catch (e) {
      console.error(e);
    }
  };

  if (loadingResource || !resource) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView className="flex-1 bg-white dark:bg-gray-900">
        <View className="p-4">
          <Text className="text-lg font-bold mb-2 dark:text-white">
            Cena za sesje / klient
          </Text>
          <TextInput
            placeholder="Cena (PLN)"
            value={price}
            onChangeText={setPrice}
            className="border p-3 rounded-lg mb-3 dark:text-white"
          />
        </View>
        <View className="p-4">
          <Text className="text-lg font-bold mb-2 dark:text-white">
            Przypisani klienci ({assignedClients.length})
          </Text>

          {assignedClients.length === 0 ? (
            <Text className="text-gray-500 dark:text-gray-400 text-center py-4">
              Brak przypisanych klientów
            </Text>
          ) : (
            assignedClients.map((clientId) => {
              const client = clients?.find((c) => c.id === clientId);
              if (!client) return null;

              const isNew = !resource.clients?.includes(clientId);

              return (
                <View
                  key={clientId}
                  className={`
            flex-row justify-between items-center p-3 mb-2 rounded-lg
            ${
              isNew
                ? "bg-green-50 dark:bg-green-900/20 border-2 border-green-500"
                : "bg-gray-50 dark:bg-gray-800"
            }
          `}
                >
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2">
                      <Text className="font-semibold dark:text-white">
                        {client.name} {client.surname}
                      </Text>
                      {isNew && (
                        <View className="bg-green-500 px-2 py-0.5 rounded">
                          <Text className="text-white text-xs font-bold">
                            NOWY
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-sm text-gray-600 dark:text-gray-400">
                      {client.email}
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => {
                      setAssignedClients((prev) =>
                        prev.filter((id) => id !== clientId),
                      );
                    }}
                    className="ml-3 p-2"
                  >
                    <Text className="text-red-500 font-bold text-lg">✕</Text>
                  </Pressable>
                </View>
              );
            })
          )}

          <CustomButton
            title={"Dodaj klienta"}
            iconName={"plus"}
            onPress={() => {
              setSelectedClientIds(assignedClients);
              setIsClientModalVisible(true);
            }}
          />
        </View>

        <FullscreenModal
          title="Wybierz klienta"
          component={ClientSelection}
          componentProps={{
            clients: clients ?? [],
            selectedClientIds: selectedClientIds,
            onSelectionChange: setSelectedClientIds,
            isLoading: clientsIsLoading,
            multiSelect: true,
            onAddClient: () => setIsAddClientModalVisible(true),
          }}
          visible={isClientModalVisible}
          onClose={() => setIsClientModalVisible(false)}
          footer={
            <CustomButton
              onPress={handleClientSelectionCloseModal}
              title={`Potwierdź (${selectedClientIds.length})`}
              iconName={""}
            />
          }
        />
        <FullscreenModal
          title="Dodaj klienta"
          component={ClientForm}
          componentProps={{
            onSubmit: async (data) => {
              await handleAddClient(data);
              setIsAddClientModalVisible(false);
            },
            submitLabel: "Stwórz klienta",
          }}
          visible={isAddClientModalVisible}
          onClose={() => setIsAddClientModalVisible(false)}

          // fullHeight
        />
      </ScrollView>
      <View className={"p-4 pb-8"}>
        <CustomButton
          loading={updateResourceIsLoading}
          title={"Aktualizuj zasób"}
          iconName={"sync"}
          onPress={handleUpdateResource}
        />
      </View>
    </SafeAreaView>
  );
};

export default ResourceEdit;
