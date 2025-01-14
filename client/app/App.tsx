import React from "react";
import CatetoriesScreen from "./Screens/CategoriesScreen";

import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MealsOverviewScreen from "./Screens/MealsOverviewScreen";
import { Provider } from "react-redux";
import { store } from "./store";

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
              headerStyle: { backgroundColor: "#351401" },
              headerTintColor: "#fff",
              contentStyle: { backgroundColor: "#3f2f25" },
            }}
          >
            <Stack.Screen
              name="MealsCategories"
              component={CatetoriesScreen}
              options={{
                title: "All Categories",
              }}
            />
            <Stack.Screen
              name="MealsOverview"
              component={MealsOverviewScreen}
              options={{
                title: "Meals",
              }}
              initialParams={{}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </>
  );
}
