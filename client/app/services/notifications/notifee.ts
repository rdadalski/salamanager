import notifee, {
  AndroidImportance,
  AndroidStyle,
  EventType,
  Event,
} from "@notifee/react-native";
import { Platform } from "react-native";
import { FirebaseMessagingTypes } from "@react-native-firebase/messaging";

// Create default notification channel for Android
export async function createDefaultChannel() {
  if (Platform.OS === "android") {
    await notifee.createChannel({
      id: "default",
      name: "Default Channel",
      importance: AndroidImportance.HIGH,
    });
  }
}

// Display a local notification
export async function displayNotification(
  title: string,
  body: string,
  data?: Record<string, any>,
) {
  // Create a channel (required for Android)
  await createDefaultChannel();

  // Display notification
  await notifee.displayNotification({
    title,
    body,
    data,
    android: {
      channelId: "default",
      pressAction: {
        id: "default",
      },
    },
  });
}

// Handle a remote (FCM) notification with Notifee
export async function onMessageReceived(
  message: FirebaseMessagingTypes.RemoteMessage,
) {
  console.log("message received");
  // Check if message contains a notification
  if (message.notification) {
    await displayNotification(
      message.notification.title || "New Notification",
      message.notification.body || "",
      message.data,
    );
  }
}

// Set up notification event listeners
export function setupNotificationListeners(
  onForegroundEvent?: (event: Event) => void,
  onBackgroundEvent?: (event: Event) => Promise<void>,
) {
  // Foreground events
  return notifee.onForegroundEvent((event) => {
    if (onForegroundEvent) {
      console.log("foreground event");
      onForegroundEvent(event);
    }

    // Default handling of press actions
    if (event.type === EventType.PRESS) {
      console.log("User pressed notification", event.detail.notification);
    }
  });
}
