import { useSignOut } from "@app/Screens/Auth";
import { HomeScreen, NotificationTestScreen } from "@app/Screens";
import AntDesign from "react-native-vector-icons/AntDesign";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FC } from "react";
import { CustomButton } from "@app/components";
import { CalendarEvents } from "@app/Screens/Calendar/CalendarScreen";

export type HomeStackParamList = {
  Home: undefined;
  Notifications: undefined;
  Calendar: undefined;
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

      <MainTab.Screen
        name="Calendar"
        component={CalendarEvents}
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
            <AntDesign name="calendar" color={color} size={size} />
          ),
        }}
      />
    </MainTab.Navigator>
  );
};
