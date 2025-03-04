import { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import {
  useLazyGetTestConnectionQuery,
  useSendNotificationMutation,
  useSendTokenMutation,
} from "@app/api/notifications";
import { selectFCMToken } from "@app/store/slices/notificationSlice";
import { useSelector } from "react-redux";

export const NotificationTestScreen = () => {
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const FCMToken = useSelector(selectFCMToken);

  const [testConnection, { isLoading: testConnectionLoading }] =
    useLazyGetTestConnectionQuery();

  const [sendNotification] = useSendNotificationMutation();

  const onTestConnection = () => {
    testConnection().then((res) => {
      alert(JSON.stringify(res.data));
    });
  };

  const testNotification = async () => {
    // if (!token) {
    //   setStatus("No token available");
    //   return;
    // }

    try {
      setStatus("Sending test notification...");
      const result = await sendNotification({});
      setStatus(`Notification sent: ${JSON.stringify(result)}`);
    } catch (error) {
      console.error("Error sending notification:", error);
      setStatus("Error sending notification");
    }
  };

  return (
    <View className="p-4">
      <Text className="text-lg mb-4">Notification Test</Text>
      <Text className="mb-2">Status: {status}</Text>
      <Text className="mb-4">
        Token: {FCMToken ? "Available" : "Not available"}
      </Text>

      <TouchableOpacity
        className="bg-green-500 p-3 rounded mb-2"
        onPress={testNotification}
      >
        <Text className="text-white text-center">Send Test Notification</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-green-500 p-3 rounded"
        onPress={onTestConnection}
      >
        <Text className="text-white text-center">Test Connection</Text>
      </TouchableOpacity>

      <View>
        {testConnectionLoading && (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
      </View>
    </View>
  );
};
