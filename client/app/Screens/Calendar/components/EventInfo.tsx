import { FC, useState } from "react";
import { useGetSingleInternalEventQuery } from "@app/api/event/events.api";
import { useGetResourceQuery } from "@app/api/resource/resource.api";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";

const EventInfo: FC<{ eventId: string; resourceId: string }> = ({
  eventId,
  resourceId,
}) => {
  const { data: eventData, isLoading: eventLoading } =
    useGetSingleInternalEventQuery({ id: eventId });
  const { data: resourceData, isLoading: resourceLoading } =
    useGetResourceQuery({ id: resourceId });

  const [price, setPrice] = useState(
    resourceData?.defaultPrice?.toString() || "0",
  );
  const [displayTitle, setDisplayTitle] = useState(resourceData?.name || "");

  const [showClientPicker, setShowClientPicker] = useState(false);
  const [selectedClients, setSelectedClients] = useState<string[]>(
    resourceData?.clients || [],
  );

  // Mock data - zastąp API call
  const availableClients = [
    { id: "1", name: "Jan Kowalski" },
    { id: "2", name: "Anna Nowak" },
    { id: "3", name: "Piotr Wiśniewski" },
  ];

  const toggleClient = (clientId: string) => {
    setSelectedClients((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId],
    );
  };

  if (eventLoading || resourceLoading) {
    return <ActivityIndicator size="large" className="flex-1" />;
  }

  if (!eventData || !resourceData) {
    return <Text className="text-gray-500">Brak danych</Text>;
  }

  const parseDays = (recurrence: string[]) => {
    const rule = recurrence[0];
    const days = rule
      .match(/BYDAY=([A-Z,]+)/)?.[1]
      .split(",")
      .map(
        (d) =>
          ({
            MO: "Pn",
            TU: "Wt",
            WE: "Śr",
            TH: "Cz",
            FR: "Pt",
            SA: "So",
            SU: "Nd",
          })[d],
      )
      .join(", ");
    return days || "";
  };

  console.log(eventData);

  return (
    <ScrollView className="flex-1 w-full p-4">
      {/* Event Info */}
      <View className="mb-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          SESJA
        </Text>
        <Text className="text-lg font-semibold text-gray-900 dark:text-white">
          {new Date(eventData.startTime).toLocaleDateString("pl-PL")}
        </Text>
        <Text className="text-sm text-gray-600 dark:text-gray-300">
          {new Date(eventData.startTime).toLocaleTimeString("pl-PL", {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          -
          {new Date(eventData.endTime).toLocaleTimeString("pl-PL", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>

      {/* Resource Header */}
      <View className="mb-6">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
          {resourceData.name}
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {resourceData.minTimeBox} • {parseDays(resourceData.recurrence)}
        </Text>
      </View>

      {/* Display Title */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Nazwa wyświetlana
        </Text>
        <TextInput
          value={displayTitle}
          onChangeText={setDisplayTitle}
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 dark:text-white"
          placeholder="Nazwa treningu"
        />
      </View>

      {/* Price */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Cena za sesję
        </Text>
        <TextInput
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-lg dark:text-white"
          placeholder="0"
        />
      </View>

      {/* Clients */}
      <View className="mb-6">
        <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Uczestnicy ({selectedClients.length})
        </Text>

        {showClientPicker ? (
          <View>
            {availableClients.map((client) => (
              <TouchableOpacity
                key={client.id}
                onPress={() => toggleClient(client.id)}
                className={`rounded-lg px-4 py-3 mb-2 ${
                  selectedClients.includes(client.id)
                    ? "bg-blue-100 dark:bg-blue-900 border-2 border-blue-500"
                    : "border border-gray-300 dark:border-gray-600"
                }`}
              >
                <Text
                  className={
                    selectedClients.includes(client.id)
                      ? "text-blue-700 dark:text-blue-300"
                      : "text-gray-900 dark:text-white"
                  }
                >
                  {client.name}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setShowClientPicker(false)}
              className="bg-green-600 rounded-lg py-3 items-center mt-2"
            >
              <Text className="text-white font-semibold">Gotowe</Text>
            </TouchableOpacity>
          </View>
        ) : selectedClients.length > 0 ? (
          <View>
            {selectedClients.map((clientId) => {
              const client = availableClients.find((c) => c.id === clientId);
              return (
                <View
                  key={clientId}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 mb-2 flex-row justify-between items-center"
                >
                  <Text className="text-gray-900 dark:text-white">
                    {client?.name}
                  </Text>
                  <TouchableOpacity onPress={() => toggleClient(clientId)}>
                    <Text className="text-red-600">×</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
            <TouchableOpacity
              onPress={() => setShowClientPicker(true)}
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg py-3 items-center mt-2"
            >
              <Text className="text-blue-600 dark:text-blue-400 font-semibold">
                + Dodaj więcej
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => setShowClientPicker(true)}
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg py-8 items-center"
          >
            <Text className="text-blue-600 dark:text-blue-400 font-semibold text-base">
              + Dodaj klientów
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Save Button */}
      <TouchableOpacity className="bg-blue-600 dark:bg-blue-700 rounded-lg py-4 items-center">
        <Text className="text-white font-semibold text-lg">Zapisz zmiany</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EventInfo;
