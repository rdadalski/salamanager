import { useSignOut } from "@app/Screens/Auth";
import { HomeScreen, NotificationTestScreen } from "@app/Screens";
import { Pressable, View, Text } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FC } from "react";
import { CustomButton } from "@app/components";

export type HomeStackParamList = {
  Home: undefined;
  Notifications: undefined;
};

export const MainTab = createBottomTabNavigator<HomeStackParamList>();

export const MainNavigator: FC = () => {
  const { signOut } = useSignOut();

  return (
    <MainTab.Navigator>
      <MainTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerRightContainerStyle: { paddingRight: 8 },
          headerRight: ({ tintColor }) => (
            <CustomButton
              title={"Logut"}
              iconName={"logout"}
              onPress={signOut}
            />
          ),
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" color={color} size={size} />
          ),
        }}
      />

      <MainTab.Screen
        name="Notifications"
        component={NotificationTestScreen}
        options={{
          headerRightContainerStyle: { paddingRight: 8 },
          headerRight: ({ tintColor }) => (
            <CustomButton
              title={"Logut"}
              iconName={"logout"}
              onPress={signOut}
            />
          ),
          tabBarBadge: 3,
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="notification" color={color} size={size} />
          ),
        }}
      />
    </MainTab.Navigator>
  );
};
