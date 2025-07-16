import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserManagementScreen from "../Screens/Admin/UserManagementScreen";

export type AdminStackParamList = {
  UserManagement: undefined;
};

const Stack = createNativeStackNavigator<AdminStackParamList>();

const AdminNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="UserManagement"
        component={UserManagementScreen}
        options={{ title: "User Management" }}
      />
    </Stack.Navigator>
  );
};

export default AdminNavigator;
