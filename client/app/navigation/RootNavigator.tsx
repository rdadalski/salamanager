import { FC, useEffect } from "react";
import { useInitializeApp } from "@app/hooks";
import { useAppDispatch } from "@app/hooks/redux";
import { fetchGoogleConfig } from "@app/store/slices";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthNavigator } from "@app/navigation/AuthNavigator";
import { MainNavigator } from "@app/navigation/MainNavigator";
import { registerUserForNotifications } from "@app/services/notifications";
import { useColorScheme } from "nativewind";

export type MainTabParamList = {
  Auth: undefined;
  Main: undefined;
};

const RootStack = createNativeStackNavigator<MainTabParamList>();

export const RootNavigator: FC = () => {
  const { isUserSignedIn, user, initializing, deviceInfo } = useInitializeApp();
  const dispatch = useAppDispatch();
  const { colorScheme, setColorScheme, toggleColorScheme } = useColorScheme();

  setColorScheme("dark");

  useEffect(() => {
    dispatch(fetchGoogleConfig());
  }, []);

  useEffect(() => {
    if (isUserSignedIn && user && deviceInfo) {
      registerUserForNotifications(user.uid, deviceInfo!);
    }
  }, [isUserSignedIn, deviceInfo]);

  return (
    <NavigationContainer
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootStack.Navigator>
        {!isUserSignedIn ? (
          // Auth flow
          <RootStack.Screen
            name="Auth"
            component={AuthNavigator}
            options={{ headerShown: false }}
          />
        ) : (
          // Main app flow
          <RootStack.Screen
            name="Main"
            component={MainNavigator}
            options={{
              headerShown: false,
            }}
          />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
