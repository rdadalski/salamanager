import { useEffect, useState } from "react";
import { FirebaseAuthTypes, getAuth } from "@react-native-firebase/auth";
import * as Device from "expo-device";
import { IDeviceInfo } from "@app/api/notifications/models/notification-models";
import { useAppDispatch, useAppSelector } from "@app/hooks/redux";
import {
  clearAuth,
  selectIsAuthenticated,
  selectUser,
  setAuth,
} from "@app/store/slices";
import { UserRole } from "@app/types";

export const useInitializeApp = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  const [initializing, setInitializing] = useState(true);
  const [deviceInfo, setDeviceInfo] = useState<IDeviceInfo>();

  const initDeviceInfo = () => {
    const isRealDevice = Device.isDevice;

    setDeviceInfo({
      brand: Device.brand as string,
      modelName: Device.modelName as string,
      deviceType: Device.deviceType as Device.DeviceType,
      isRealDevice,
    });
  };

  useEffect(() => {
    const onAuthStateChanged = async (user: FirebaseAuthTypes.User | null) => {
      if (user && user.emailVerified) {
        const idTokenResult = await user.getIdTokenResult(true);

        console.log(idTokenResult);

        const role = (idTokenResult.claims.role as UserRole) || UserRole.GUEST;
        console.log("VERIFIED USER ROLE:", role);

        dispatch(
          setAuth({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: role,
          }),
        );

        initDeviceInfo();
      } else {
        dispatch(clearAuth());
      }

      if (initializing) {
        setInitializing(false);
      }
    };

    const subscriber = getAuth().onAuthStateChanged(onAuthStateChanged);

    return subscriber;
  }, [dispatch, initializing]);

  return { isUserSignedIn: isAuthenticated, user, initializing, deviceInfo };
};
