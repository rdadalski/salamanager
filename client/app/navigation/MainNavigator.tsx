import { useSignOut } from "@app/Screens/Auth";
import {
  HomeScreen,
  AccountingScreenTrainer,
  AccountingScreenUser,
} from "@app/Screens";
import AntDesign from "react-native-vector-icons/AntDesign";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FC } from "react";
import { CustomButton } from "@app/components";
import { CalendarStackNavigator } from "@app/navigation/CalendarNavigation";
import { useAppSelector } from "@app/hooks/redux";
import { selectUserRole } from "@app/store/slices";
import { UserRole } from "@app/types";
import AdminNavigator from "@app/navigation/AdminNavigation";

export type HomeStackParamList = {
  "Home screen": undefined;
  Notifications: undefined;
  Calendar: undefined;
  "Accounting Trainer": undefined;
  "Accounting User": undefined;
  Admin: undefined;
};

export const MainTab = createBottomTabNavigator<HomeStackParamList>();

export const MainNavigator: FC = () => {
  const { signOut } = useSignOut();

  const userRole = useAppSelector(selectUserRole);

  return (
    <MainTab.Navigator>
      <MainTab.Screen
        name="Home screen"
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
      {(userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN) && (
        <MainTab.Screen
          name="Admin"
          component={AdminNavigator} // The component is our entire AdminNavigator stack
          options={{
            headerShown: false, // Hide header, as AdminNavigator has its own
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="tool" color={color} size={size} />
            ),
          }}
        />
      )}
      <MainTab.Screen
        name="Accounting Trainer"
        component={AccountingScreenTrainer}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="creditcard" color={color} size={size} />
          ),
        }}
      />
      <MainTab.Screen
        name="Accounting User"
        component={AccountingScreenUser}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="creditcard" color={color} size={size} />
          ),
        }}
      />
    </MainTab.Navigator>
  );
};
