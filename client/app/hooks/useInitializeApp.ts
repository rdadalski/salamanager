import { useEffect, useState } from "react";
import { FirebaseAuthTypes, getAuth } from "@react-native-firebase/auth";
import * as Device from "expo-device";
import { IDeviceInfo } from "@app/api/notifications/models/notification-models";

export const useInitializeApp = () => {
  const [isUserSignedIn, setSignedIn] = useState<boolean>(false);
  const [initializing, setInitializing] = useState(true);
  const [deviceInfo, setDeviceInfo] = useState<IDeviceInfo>();
  const [user, setUser] = useState<FirebaseAuthTypes.User>();

  const initDeviceInfo = () => {
    const isRealDevice = Device.isDevice;

    setDeviceInfo({
      brand: Device.brand as string,
      modelName: Device.modelName as string,
      deviceType: Device.deviceType as Device.DeviceType,
      isRealDevice,
    });
  };

  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    if (user && user.emailVerified) {
      setUser(user as FirebaseAuthTypes.User);
      setSignedIn(true);
      initDeviceInfo();
    } else {
      setSignedIn(false);
    }

    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = getAuth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  return { isUserSignedIn, user, initializing, deviceInfo };
};
