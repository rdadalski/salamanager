import { useState } from "react";
import { IFirestoreUserData, UserRole } from "@app/types";
import { useUpdateUserRoleMutation } from "@app/api/users/usersApi";
import { Alert, View, Text, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";

const UserListItem = ({ item }: { item: IFirestoreUserData }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(item.role);

  const [updateUserRole, { isLoading: isUpdating }] =
    useUpdateUserRoleMutation();

  const handleSaveChanges = async () => {
    if (selectedRole === item.role) {
      Alert.alert("No Changes", "The role has not been changed.");
      return;
    }
    try {
      await updateUserRole({ uid: item.uid, role: selectedRole }).unwrap();
      Alert.alert("Success", "User role has been updated.");
    } catch (err) {
      Alert.alert("Error", "Failed to update user role.");
      console.error(err);
    }
  };

  return (
    <View className="p-4 border-b border-gray-200 bg-white mx-4 my-2 rounded-lg shadow-sm">
      <Text className="text-lg font-bold">
        {item.displayName || item.email}
      </Text>
      <Text className="text-gray-600">{item.email}</Text>

      <Picker
        selectedValue={selectedRole}
        onValueChange={(itemValue) => setSelectedRole(itemValue)}
        style={{ height: 50, width: "100%" }}
      >
        {Object.values(UserRole).map((role) => (
          <Picker.Item
            key={role}
            label={role.replace("_", " ").toUpperCase()}
            value={role}
          />
        ))}
      </Picker>

      <TouchableOpacity
        onPress={handleSaveChanges}
        disabled={isUpdating}
        className={`mt-2 p-2 rounded-md ${isUpdating ? "bg-gray-400" : "bg-blue-500"}`}
      >
        <Text className="text-white text-center font-bold">
          {isUpdating ? "Saving..." : "Save Changes"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserListItem;
