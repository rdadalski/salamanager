import { Alert, AppState } from "react-native";
import * as NotifeeService from "./notifee";
import * as MessagingService from "./messaging";
import { store } from "@app/store/store";
import { registerFCMToken } from "@app/store/slices/notificationSlice";
import { IDeviceInfo } from "@app/api/notifications/models/notification-models";
import { getApp } from "@react-native-firebase/app";
import { getAuth } from "@react-native-firebase/auth";
import {
  getMessaging,
  onMessage,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";

export async function initializeNotifications() {
  const hasPermission = await MessagingService.requestUserPermission();
  if (!hasPermission) {
    console.log("User declined notification permissions");
    return false;
  }

  await NotifeeService.createDefaultChannel();

  setupMessagingListeners();

  NotifeeService.setupNotificationListeners((event) => {
    console.log("Foreground notification event:", event);
  });

  return true;
}

export function registerUserForNotifications(
  userId: string,
  deviceInfo: IDeviceInfo,
) {
  store.dispatch(registerFCMToken({ userId, deviceInfo }));
}

function setupMessagingListeners() {
  setBackgroundMessageHandler(getMessaging(), async (remoteMessage) => {
    console.log("Message handled in the background:", remoteMessage);

    const action = remoteMessage.data?.action;

    console.log(remoteMessage);

    if (action === "FORCE_REAUTH") {
      console.log("Force re-authentication signal received. Signing out user.");
      try {
        await getAuth().signOut();
        console.log("User signed out successfully in the background.");
        return;
      } catch (error) {
        console.error("Error signing out user in background handler:", error);
      }
    }

    await NotifeeService.onMessageReceived(remoteMessage);
  });

  const unsubscribe = onMessage(getMessaging(), async (remoteMessage) => {
    console.log("Message received in foreground:", remoteMessage);

    const action = remoteMessage.data?.action;

    if (action === "FORCE_REAUTH") {
      console.log(
        "Force re-auth signal received in foreground. Signing out...",
      );
      Alert.alert(
        "Permissions Changed",
        "Your permissions have been updated by an administrator. Please log in again.",
      );
      await getAuth().signOut();
      return;
    }

    if (AppState.currentState !== "active") {
      await NotifeeService.onMessageReceived(remoteMessage);
    }
  });

  return unsubscribe;
}

export {
  displayNotification,
  createDefaultChannel,
  setupNotificationListeners,
} from "./notifee";

export { requestUserPermission, getFCMToken } from "./messaging";
