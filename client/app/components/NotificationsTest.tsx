import React, { useEffect, useState } from "react";
import { NotificationService } from "../services";
import {View, Text, TouchableOpacity, Platform, ActivityIndicator} from "react-native";
import * as Device from "expo-device";
import {useLazyGetTestConnectionQuery, useSendTokenMutation} from "../store/api/notifications.api";
import {useLazyGetTestGenericQuery} from "../store/api/testGenericApi";

export const NotificationTest = () => {
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");

  // useGetTestConnectionQuery,
  //  useLazyGetTestConnectionQuery,
  //  useGetUserTokenMutation,
  //  useSendNotificationMutation,
  //  useSendTokenMutation,

  const [sendToken, {isLoading: tokenIsLoading}] = useSendTokenMutation();
  const [testConnection, {isLoading: testConnectionLoading}] = useLazyGetTestConnectionQuery();

  const onTestConnection = () => {
    testConnection().then((res) => {
      alert(JSON.stringify(res.data));
    })
  }

  useEffect(() => {
    registerDevice();
  }, []);

  const registerDevice = async () => {
    try {
      setStatus("Registering device...");
      const token = await NotificationService.registerForPushNotificationsAsync();
      setToken(token);

      if (token) {
        // TODO tutaj trzeba dodać obsługę DTO z backendu
        await sendToken({});

        // await fetch("YOUR_API_URL/notifications/token", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({
        //     userId: "testUser123", // Replace with actual user ID
        //     token,
        //     deviceInfo: {
        //       platform: Platform.OS,
        //       deviceId: Device.deviceName,
        //     },
        //   }),
        // });

        setStatus("Device registered successfully");
      }
    } catch (error) {
      console.error("Error registering device:", error);
      setStatus("Error registering device");
    }
  };

  const testNotification = async () => {
    if (!token) {
      setStatus("No token available");
      return;
    }

    try {
      setStatus("Sending test notification...");

      // zamiast fetch trzeba zrobić endpoint w storze
      const response = await fetch("YOUR_API_URL/notifications/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          title: "Test Notification",
          body: "This is a test notification from the app",
          data: {
            type: "test",
            timestamp: new Date().toISOString(),
          },
        }),
      });

      const result = await response.json();
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
      <Text className="mb-4">Token: {token ? "Available" : "Not available"}</Text>

      <TouchableOpacity
        className="bg-blue-500 p-3 rounded mb-2"
        onPress={registerDevice}
      >
        <Text className="text-white text-center">Register Device</Text>
      </TouchableOpacity>

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
         <ActivityIndicator
          size="large"
          color="#0000ff"
         />
        )}
      </View>
    </View>
  );
};
