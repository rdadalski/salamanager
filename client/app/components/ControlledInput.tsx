import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

interface ControlledInputProps<T extends FieldValues> extends TextInputProps {
  control: Control<T>;
  name: Path<T>;
  label: string;
  rules?: object;
}

export const ControlledInput = <T extends FieldValues>({
  control,
  name,
  label,
  rules = {},
  ...textInputProps
}: ControlledInputProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View className="mb-4">
          <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
            {label}
          </Text>
          <TextInput
            className="border border-gray-300 rounded px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 h-11"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value as string}
            {...textInputProps}
          />
          {error && (
            <Text className="text-red-500 text-xs mt-1">{error.message}</Text>
          )}
        </View>
      )}
    />
  );
};
