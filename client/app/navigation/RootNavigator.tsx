import { FC, useEffect } from "react";
import { useInitializeApp } from "@app/hooks";
import { useAppDispatch } from "@app/hooks/redux";
import { fetchGoogleConfig } from "@app/store/slices";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  Theme,
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

const MyDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#3B82F6", // Kolor 'blue-500'
    background: "#111827", // Kolor 'bg-gray-900'
    card: "#1F2937", // Kolor 'bg-gray-800' (dla nagłówków i tab-barów)
    text: "#FFFFFF", // Kolor 'text-white'
    border: "#374151", // Kolor 'border-gray-700'
    notification: "#EF4444", // Kolor 'red-500'
  },
};

const MyDefaultTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#2563EB", // Kolor 'blue-600'
    background: "#F9FAFB", // Kolor 'bg-gray-50'
    card: "#FFFFFF", // Kolor 'bg-white' (dla nagłówków i tab-barów)
    text: "#1F2937", // Kolor 'text-gray-800'
    border: "#E5E7EB", // Kolor 'border-gray-200'
  },
};

const RootStack = createNativeStackNavigator<MainTabParamList>();

export const RootNavigator: FC = () => {
  const { isUserSignedIn, user, initializing, deviceInfo } = useInitializeApp();
  const dispatch = useAppDispatch();

  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  useEffect(() => {
    dispatch(fetchGoogleConfig());
  }, []);

  useEffect(() => {
    if (isUserSignedIn && user && deviceInfo) {
      registerUserForNotifications(user.uid, deviceInfo!);
    }
  }, [isUserSignedIn, deviceInfo]);

  return (
    <NavigationContainer theme={isDarkMode ? MyDarkTheme : MyDefaultTheme}>
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
