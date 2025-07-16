import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useGetUsersQuery } from "@app/api/users/usersApi";
import UserListItem from "@app/Screens/Admin/components/UserListItem";

const UserManagementScreen = () => {
  const {
    data: users,
    isLoading,
    isError,
    error: userError,
  } = useGetUsersQuery(undefined, {
    refetchOnFocus: true,
  });

  console.log(users);

  if (isLoading) return <ActivityIndicator size="large" className="flex-1" />;
  if (isError) {
    console.error("Error fetching users:");
    console.error(userError);
    return (
      <Text className="flex-1 text-center text-red-500">
        Error fetching users.
      </Text>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 pt-4">
      <FlatList
        data={users}
        renderItem={({ item }) => <UserListItem item={item} />}
        keyExtractor={(item) => item.uid}
      />
    </View>
  );
};

export default UserManagementScreen;
