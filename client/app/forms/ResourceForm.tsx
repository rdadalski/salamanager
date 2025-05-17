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
import { Controller, useForm } from "react-hook-form";
import { CustomButton } from "@app/components";
import { MultiSelectComponent } from "@app/components/CustomMultiselect";
import { useGetUsersQuery } from "@app/api/users/usersApi";

export const ResourceForm: FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm({
    defaultValues: {
      name: "",
      defaultPrice: "string",
      ownerId: "string", // picker
      minTimeBox: "string", // ?
      clients: "string[]", // multipick
    },
  });

  const { data: userList, isLoading: userListLoading } = useGetUsersQuery();

  console.log(userList);

  const onSubmit = () => {
    console.log(getValues);
  };

  return (
    <ScrollView className="flex w-full bg-white dark:bg-gray-900">
      <View className="mb-6">
        <Controller
          control={control}
          rules={{ required: "name is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="mb-4">
              <Text className="font-medium mb-1">Name</Text>
              <TextInput
                className="h-10 border border-gray-300 rounded px-3 bg-white"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Summary"
              />
              {errors.name && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </Text>
              )}
            </View>
          )}
          name="name"
        />

        <Controller
          control={control}
          rules={{ required: "defaultPrice is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="mb-4">
              <Text className="font-medium mb-1">Default price </Text>
              <TextInput
                className="h-10 border border-gray-300 rounded px-3 bg-white"
                onBlur={onBlur}
                onChangeText={onChange}
                keyboardType={"numeric"}
                value={value}
                placeholder="Default Price"
              />
              {errors.defaultPrice && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.defaultPrice.message}
                </Text>
              )}
            </View>
          )}
          name="defaultPrice"
        />

        <Controller
          control={control}
          rules={{ required: "name is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="mb-4">
              <Text className="font-medium mb-1">Owner ID</Text>
              <TextInput
                className="h-10 border border-gray-300 rounded px-3 bg-white"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="owner Id"
              />
              {errors.ownerId && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.ownerId.message}
                </Text>
              )}
            </View>
          )}
          name="ownerId"
        />

        <Controller
          control={control}
          rules={{ required: "name is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="mb-4">
              <Text className="font-medium mb-1">Time box </Text>
              <TextInput
                className="h-10 border border-gray-300 rounded px-3 bg-white"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Summary"
              />
              {errors.minTimeBox && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.minTimeBox.message}
                </Text>
              )}
            </View>
          )}
          name="minTimeBox"
        />

        {/* User Selection */}
        <View className="mb-4 w-full">
          <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
            Select Users - multipick in progress
          </Text>
          <MultiSelectComponent data={userList!} />
        </View>

        {/* Submit Button */}
        <CustomButton title={"submit"} onPress={onSubmit} iconName={"plus"} />
      </View>
    </ScrollView>
  );
};
