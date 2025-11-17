import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

interface StatusPickerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
}

const STATUSES = [
  { value: "pending", label: "Pending", color: "bg-yellow-500" },
  { value: "active", label: "Active", color: "bg-green-500" },
  { value: "inactive", label: "Inactive", color: "bg-gray-500" },
] as const;

export const StatusPicker = <T extends FieldValues>({
  control,
  name,
  label,
}: StatusPickerProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View className="mb-4">
          <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
            {label}
          </Text>
          <View className="flex-row gap-2">
            {STATUSES.map((status) => (
              <TouchableOpacity
                key={status.value}
                onPress={() => onChange(status.value)}
                className={`
                  flex-1 py-3 rounded-lg border-2
                  ${
                    value === status.value
                      ? `${status.color} border-transparent`
                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  }
                `}
              >
                <Text
                  className={`text-center font-medium ${
                    value === status.value
                      ? "text-white"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {status.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    />
  );
};
