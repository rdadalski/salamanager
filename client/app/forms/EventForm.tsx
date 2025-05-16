import { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { TextInput, View, Text, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { IInternalEvent } from "@app/types";
import { FullscreenModal } from "@app/components/CustomModal";
import { ResourceForm } from "@app/forms/ResourceForm";
import { CustomButton } from "@app/components";

interface EventFormProps {
  googleEventId: string;
  calendarId: string;
  summary: string;
  displayTitle?: string;
  startTime: string;
  endTime: string;
}

const mockResources = [
  { id: "1", name: "Document Template" },
  { id: "2", name: "Marketing Assets" },
  { id: "3", name: "Project Plan" },
  { id: "4", name: "Customer Database" },
];

export const EventForm: FC<EventFormProps> = ({
  googleEventId,
  calendarId,
  summary,
  displayTitle,
  startTime,
  endTime,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      resourceId: "",
      googleEventId,
      calendarId,
      summary,
      displayTitle,
      startTime,
      endTime,
    },
  });

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handlePopUp = () => {
    setModalVisible(true);
  };

  const onSubmit = () => {
    console.log(getValues());
  };

  const handleAddResource = () => {
    setModalVisible(true);
  };

  return (
    <View className="flex-1 w-full">
      <Controller
        control={control}
        rules={{ required: "Summary is required" }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="mb-4">
            <Text className="font-medium mb-1">Summary</Text>
            <TextInput
              className="h-10 border border-gray-300 rounded px-3 bg-white"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Summary"
            />
            {errors.summary && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.summary.message}
              </Text>
            )}
          </View>
        )}
        name="summary"
      />
      <Controller
        control={control}
        rules={{}}
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="mb-4">
            <Text className="font-medium mb-1">Display title</Text>
            <TextInput
              className="h-10 border border-gray-300 rounded px-3 bg-white"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Display title"
            />
            {errors.displayTitle && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.displayTitle.message}
              </Text>
            )}
          </View>
        )}
        name="displayTitle"
      />
      <Controller
        name={"resourceId"}
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="mb-4">
            <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
              Select Resource
            </Text>
            <View className="flex-row gap-2 justify-between items-center">
              <View className="w-3/4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                <Picker
                  selectedValue={value}
                  onValueChange={(value) => onChange(value)}
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
              <CustomButton
                iconName={"plus"}
                onPress={handleAddResource}
                title={"dodaj"}
              ></CustomButton>
            </View>
          </View>
        )}
      />

      <View className="mt-2 gap-1">
        <Button title="log submit" onPress={onSubmit} color="#3b82f6" />
      </View>
      <FullscreenModal
        component={ResourceForm}
        onClose={() => setModalVisible(false)}
        visible={modalVisible}
      ></FullscreenModal>
    </View>
  );
};
