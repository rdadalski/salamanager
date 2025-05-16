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

export const ResourceForm: FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm({
    defaultValues: {
      name: "",
      defaultPrice: 0,
      ownerId: "string",
      minTimeBox: "string",
      clients: "string[]",
    },
  });

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

        {/* User Selection */}
        <View className="mb-4">
          <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
            Select Users
          </Text>
        </View>

        {/* Submit Button */}
        <CustomButton title={"submit"} onPress={onSubmit} iconName={"plus"} />
      </View>
    </ScrollView>
  );
};
