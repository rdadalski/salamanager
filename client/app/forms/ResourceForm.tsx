import { FC, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

interface IResourceFormProps {
  onSubmit?: (data: {
    title: string;
    resourceId: string;
    userIds: string[];
  }) => void;
}

type Resource = {
  id: string;
  name: string;
};

type User = {
  id: string;
  name: string;
};

// Mock data for resources and users
const mockResources: Resource[] = [
  { id: "1", name: "Document Template" },
  { id: "2", name: "Marketing Assets" },
  { id: "3", name: "Project Plan" },
  { id: "4", name: "Customer Database" },
];

const mockUsers: User[] = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Robert Johnson" },
  { id: "4", name: "Emily Williams" },
];

export const ResourceForm: FC<IResourceFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [selectedResource, setSelectedResource] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleSubmit = () => {
    if (!title || !selectedResource || selectedUsers.length === 0) {
      // You could add more detailed validation here
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      if (onSubmit) {
        onSubmit({
          title,
          resourceId: selectedResource,
          userIds: selectedUsers,
        });
      }
      setIsSubmitting(false);

      // Reset form (optional)
      setTitle("");
      setSelectedResource("");
      setSelectedUsers([]);
    }, 1000);
  };

  return (
    <ScrollView className="flex w-full bg-white dark:bg-gray-900">
      <View className="mb-6">
        <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Assign Resource
        </Text>

        {/* Title Input */}
        <View className="mb-4">
          <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
            Title
          </Text>
          <TextInput
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="Enter assignment title"
            placeholderTextColor="#9CA3AF"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Resource Selector */}
        <View className="mb-4">
          <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
            Select Resource
          </Text>
          <View className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
            <Picker
              selectedValue={selectedResource}
              onValueChange={(itemValue) => setSelectedResource(itemValue)}
              style={{ color: "#1F2937" }}
            >
              {/*<Picker.Item label="Select a resource..." value="" />*/}
              {mockResources.map((resource) => (
                <Picker.Item
                  key={resource.id}
                  label={resource.name}
                  value={resource.id}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* User Selection */}
        <View className="mb-4">
          <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
            Select Users
          </Text>
          <View className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 p-2">
            {mockUsers.map((user) => (
              <Pressable
                key={user.id}
                className={`flex-row items-center p-3 mb-1 rounded-md ${
                  selectedUsers.includes(user.id)
                    ? "bg-blue-100 dark:bg-blue-900"
                    : "bg-gray-50 dark:bg-gray-700"
                }`}
                onPress={() => handleToggleUser(user.id)}
              >
                <View
                  className={`w-5 h-5 mr-3 border rounded ${
                    selectedUsers.includes(user.id)
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-400 dark:border-gray-500"
                  }`}
                >
                  {selectedUsers.includes(user.id) && (
                    <Text className="text-white text-center">✓</Text>
                  )}
                </View>
                <Text
                  className={`${
                    selectedUsers.includes(user.id)
                      ? "text-blue-800 dark:text-blue-200 font-medium"
                      : "text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {user.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Submit Button */}
        <Pressable
          className={`mt-4 py-3 px-6 rounded-lg flex-row justify-center items-center ${
            !title || !selectedResource || selectedUsers.length === 0
              ? "bg-gray-400 dark:bg-gray-700"
              : "bg-blue-500 dark:bg-blue-600 active:bg-blue-600 dark:active:bg-blue-700"
          }`}
          onPress={handleSubmit}
          disabled={
            !title ||
            !selectedResource ||
            selectedUsers.length === 0 ||
            isSubmitting
          }
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text className="text-white font-bold text-center">
              Assign Resource
            </Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
};
