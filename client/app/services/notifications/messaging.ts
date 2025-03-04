import messaging from "@react-native-firebase/messaging";
import { getApp } from "@react-native-firebase/app";
import { Platform } from "react-native";

/**
 * Request user permission for notifications
 * @returns {Promise<boolean>} Whether permission was granted
 */
export async function requestUserPermission(): Promise<boolean> {
  if (Platform.OS === "ios") {
    const authStatus = await getApp().messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
  }

  // Android doesn't require explicit permission for FCM
  return true;
}

/**
 * Get the FCM token for the device
 * @returns {Promise<string|null>} FCM token
 */
export async function getFCMToken(): Promise<string | null> {
  try {
    return await getApp().messaging().getToken();
  } catch (error) {
    console.error("Failed to get FCM token:", error);
    return null;
  }
}
