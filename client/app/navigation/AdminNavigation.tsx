import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserManagementScreen from "../Screens/Admin/UserManagementScreen";
import { SafeAreaView } from "react-native-safe-area-context";

export type AdminStackParamList = {
  UserManagement: undefined;
};

const Stack = createNativeStackNavigator<AdminStackParamList>();

const AdminNavigator = () => {
  return (
    <SafeAreaView className={"flex-1"}>
      <Stack.Navigator>
        <Stack.Screen
          name="UserManagement"
          component={UserManagementScreen}
          options={{ title: "User Management" }}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
};

export default AdminNavigator;
