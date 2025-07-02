import { useSignOut } from "@app/Screens/Auth";
import { ClientHomeScreen, NotificationTestScreen } from "@app/Screens";
import AntDesign from "react-native-vector-icons/AntDesign";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FC } from "react";
import { CustomButton } from "@app/components";
import { CalendarStackNavigator } from "@app/navigation/CalendarNavigation";

export type HomeStackParamList = {
  "Home screen": undefined;
  Notifications: undefined;
  Calendar: undefined;
};

export const MainTab = createBottomTabNavigator<HomeStackParamList>();

export const MainNavigator: FC = () => {
  const { signOut } = useSignOut();

  return (
    <MainTab.Navigator>
      <MainTab.Screen
        name="Home screen"
        component={ClientHomeScreen}
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

      {/*<MainTab.Screen*/}
      {/*  name="Calendar"*/}
      {/*  component={CalendarScreen}*/}
      {/*  options={{*/}
      {/*    headerRightContainerStyle: { paddingRight: 8 },*/}
      {/*    headerRight: ({ tintColor }) => (*/}
      {/*      <CustomButton*/}
      {/*        title={"Logut"}*/}
      {/*        iconName={"logout"}*/}
      {/*        onPress={signOut}*/}
      {/*      />*/}
      {/*    ),*/}
      {/*    tabBarBadge: 3,*/}
      {/*    tabBarIcon: ({ color, size }) => (*/}
      {/*      <AntDesign name="calendar" color={color} size={size} />*/}
      {/*    ),*/}
      {/*  }}*/}
      {/*/>*/}
      <MainTab.Screen
        name="Calendar"
        component={CalendarStackNavigator}
        options={{
          headerRightContainerStyle: { paddingRight: 8 },
          headerRight: ({ tintColor }) => (
            <CustomButton
              title={"Logut"}
              iconName={"logout"}
              onPress={signOut}
            />
          ),
          headerShown: false, // Hide this header since CalendarStack has its own
          tabBarLabel: "Calendar",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="calendar" color={color} size={size} />
          ),
        }}
      />
    </MainTab.Navigator>
  );
};
