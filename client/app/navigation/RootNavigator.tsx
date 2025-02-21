import { FC, useEffect } from "react";
import { useInitializeApp } from "@app/hooks";
import { useAppDispatch, useAppSelector } from "@app/hooks/redux";
import { fetchGoogleConfig } from "@app/store/slices";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthNavigator } from "@app/navigation/AuthNavigator";
import { MainNavigator } from "@app/navigation/MainNavigator";

export type MainTabParamList = {
  Auth: undefined;
  Main: undefined;
};

const RootStack = createNativeStackNavigator<MainTabParamList>();

export const RootNavigator: FC = () => {
  const { isUserSignedIn, user, initializing } = useInitializeApp();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchGoogleConfig());
  }, []);

  return (
    <NavigationContainer>
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
