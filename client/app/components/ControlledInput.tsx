import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

interface ControlledInputProps<T extends FieldValues> extends TextInputProps {
  control: Control<T>;
  name: Path<T>;
  label: string;
  rules?: object;
  transform?: {
    input?: (value: any) => string; // RHF value → TextInput value
    output?: (text: string) => any; // TextInput text → RHF value
  };
}

export const ControlledInput = <T extends FieldValues>({
  control,
  name,
  label,
  rules = {},
  transform,
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
            className="border dark:text-white dark:border-white border-black mb-3 px-2"
            onBlur={onBlur}
            onChangeText={(text) => {
              const transformed = transform?.output
                ? transform.output(text)
                : text;
              onChange(transformed);
            }}
            value={
              transform?.input
                ? transform.input(value)
                : (value?.toString() ?? "")
            }
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
