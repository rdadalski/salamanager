import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export interface NotificationToken {
  token: string;
  deviceId: string;
  platform: string;
}

// Configure how notifications are presented when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const NotificationService = {
  async registerForPushNotificationsAsync() {
    let token;

    if (!Device.isDevice) {
      alert("Push Notifications don't work on simulator. Please use physical device");
      return;
    }

    // Check if we have permission, if not request it
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }

    // Android-specific channel setup
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    // iOS-specific setup
    if (Platform.OS === "ios") {
      await Notifications.setNotificationCategoryAsync("default", [
        {
          identifier: "default",
          buttonTitle: "View",
        },
      ]);
    }

    try {
      token = (await Notifications.getDevicePushTokenAsync()).data;
    } catch (error) {
      console.error("Error getting push token:", error);
      return;
    }

    return token;
  },

  async storeToken(token: string): Promise<NotificationToken> {
    const deviceId = Device.deviceName ?? "unknown";
    const tokenData: NotificationToken = {
      token,
      deviceId,
      platform: Platform.OS,
    };

    try {
      // Here we'll add API call to your backend later
      return tokenData;
    } catch (error) {
      console.error("Error storing push token:", error);
      throw error;
    }
  },

  async setupNotificationListeners() {
    // Handle notifications when app is in foreground
    const foregroundSubscription = Notifications.addNotificationReceivedListener((notification) => {
      console.log("Received notification:", notification);
      // You can add custom handling here
    });

    // Handle user interaction with notification
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        console.log("Notification response:", data);
        // You can add navigation or other handling here
      }
    );

    return () => {
      foregroundSubscription.remove();
      responseSubscription.remove();
    };
  },

  // Method to handle background notifications
  async setupBackgroundNotifications() {
    Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      // Handle background notification interaction
      console.log("Background notification response:", data);
    });
  },
};
