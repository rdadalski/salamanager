import { AppState } from "react-native";
import * as NotifeeService from "./notifee";
import * as MessagingService from "./messaging";
import { store } from "@app/store/store";
import { registerFCMToken } from "@app/store/slices/notificationSlice";
import { IDeviceInfo } from "@app/api/notifications/models/notification-models";
import { getApp } from "@react-native-firebase/app";

// Initialize all notification services
export async function initializeNotifications() {
  // Request permission first
  const hasPermission = await MessagingService.requestUserPermission();
  if (!hasPermission) {
    console.log("User declined notification permissions");
    return false;
  }

  // Set up Notifee channel
  await NotifeeService.createDefaultChannel();

  // Set up messaging listeners
  setupMessagingListeners();

  // Set up Notifee event listeners
  NotifeeService.setupNotificationListeners(
    // Foreground event handler
    (event) => {
      console.log("Foreground notification event:", event);
    },
  );

  return true;
}

export function registerUserForNotifications(
  userId: string,
  deviceInfo: IDeviceInfo,
) {
  // Dispatch the Redux action to register the token
  store.dispatch(registerFCMToken({ userId, deviceInfo }));
}

// Set up Firebase messaging listeners
function setupMessagingListeners() {
  // Handle background messages
  getApp()
    .messaging()
    .setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Message handled in the background:", remoteMessage);
      await NotifeeService.onMessageReceived(remoteMessage);
    });

  // Handle foreground messages
  const unsubscribe = getApp()
    .messaging()
    .onMessage(async (remoteMessage) => {
      console.log("Message received in foreground:", remoteMessage);

      // Only show foreground notifications when app is in background or inactive
      if (AppState.currentState !== "active") {
        await NotifeeService.onMessageReceived(remoteMessage);
      }
    });

  return unsubscribe;
}

// Re-export all functions from submodules
export {
  displayNotification,
  createDefaultChannel,
  setupNotificationListeners,
} from "./notifee";

export { requestUserPermission, getFCMToken } from "./messaging";
