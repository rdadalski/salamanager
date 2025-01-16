import React from "react";

import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import { store } from "./store";
import HomeScreen from "./Screens/HomeScreen";

export type RootStackParamList = {
  Home: undefined;
  MealsCategories: undefined;
  MealsOverview: { categoryId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <>
      <Provider store={store}>
        <StatusBar style="light"></StatusBar>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: "#000" },
              headerTintColor: "#fff",
              contentStyle: { backgroundColor: "#FFF" },
            }}
          >
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: "Home",
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </>
  );
}
