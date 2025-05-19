import { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { TextInput, View, Text, Button, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { IResource } from "@app/types";
import { FullscreenModal } from "@app/components/CustomModal";
import { ResourceForm } from "@app/forms/ResourceForm";
import { CustomButton } from "@app/components";
import { useGetAllResourcesQuery } from "@app/api/resource/resource.api";
import { useCreateInternalEventMutation } from "@app/api/event/events.api";

type EventFormProps = {
  googleEventId: string;
  calendarId: string;
  summary: string;
  displayTitle?: string;
  startTime: string;
  endTime: string;
};

type EventFormValues = EventFormProps & {
  resourceId: string;
};

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
  } = useForm<EventFormValues>({
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

  const {
    data: resourceList,
    isLoading: loadingResources,
    refetch: refetchResourceList,
  } = useGetAllResourcesQuery();

  const [createEvents] = useCreateInternalEventMutation();

  const onSubmit = async () => {
    const response = await createEvents({ values: getValues() });
  };

  const handleAddResource = () => {
    setModalVisible(true);
  };

  const handleCloseModal = async () => {
    await refetchResourceList();
    setModalVisible(false);
  };

  return (
    <>
      {loadingResources || !resourceList ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
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
                {resourceList?.length > 0 ? (
                  <View className="flex-row gap-2 justify-between items-center">
                    <View className="w-3/4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                      <Picker
                        selectedValue={value}
                        onBlur={onBlur}
                        onValueChange={(value) => {
                          console.log(value);
                          console.log(resourceList);
                          onChange(value);
                        }}
                        style={{ color: "#1F2937" }}
                      >
                        <Picker.Item label="Select a resource..." value="" />
                        {resourceList.map((resource: IResource) => (
                          <Picker.Item
                            key={String(resource.id)}
                            label={String(resource.name)}
                            value={String(resource.id)}
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
                ) : (
                  <CustomButton
                    iconName={"plus"}
                    onPress={handleAddResource}
                    title={"dodaj"}
                  ></CustomButton>
                )}
              </View>
            )}
          />

          <View className="mt-2 gap-1">
            <Button title="log submit" onPress={onSubmit} color="#3b82f6" />
          </View>
          <FullscreenModal
            component={ResourceForm}
            onClose={handleCloseModal}
            visible={modalVisible}
          ></FullscreenModal>
        </View>
      )}
    </>
  );
};
