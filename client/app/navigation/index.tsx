import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen, NotificationTestScreen } from "../Screens";
import { SignInScreen, SignUpScreen } from "../Screens/Auth";
import { AuthStackParamList } from "../Screens/Auth/types/auth.types";
import { FC } from "react";

export type MainTabParamList = {
  Auth: undefined;
  Main: undefined;
};

export type RootStackParamList = {
  Home: undefined;
  NotificationTestScreen: undefined;
};

// Create navigators
const RootStack = createNativeStackNavigator<MainTabParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<RootStackParamList>();

// Auth stack navigator
function AuthNavigator() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      {/*<AuthStack.Screen*/}
      {/*  name="ForgotPassword"*/}
      {/*  component={ForgotPasswordScreen}*/}
      {/*/>*/}
    </AuthStack.Navigator>
  );
}

// Main tab navigator (after login)
function MainNavigator() {
  return (
    <MainTab.Navigator>
      <MainTab.Screen name="Home" component={HomeScreen} />
      <MainTab.Screen
        name="NotificationTestScreen"
        component={NotificationTestScreen}
      />
    </MainTab.Navigator>
  );
}

export const RootNavigator: FC<{ isSignedIn: boolean }> = ({ isSignedIn }) => {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        {!isSignedIn ? (
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
            options={{ headerShown: false }}
          />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
