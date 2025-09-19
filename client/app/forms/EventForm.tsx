import { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  TextInput,
  View,
  Text,
  Button,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { IResource } from "@app/types";
import { FullscreenModal } from "@app/components/CustomModal";
import { ResourceForm } from "@app/forms/ResourceForm";
import { CustomButton } from "@app/components";
import { useGetAllResourcesQuery } from "@app/api/resource/resource.api";
import { useCreateInternalEventMutation } from "@app/api/event/events.api";
import { useColorScheme } from "nativewind";
import { ControlledInput } from "@app/components/ControlledInput";

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

// TODO refactor to smaller pieces

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

  const { colorScheme } = useColorScheme();

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const {
    data: resourceList,
    isLoading: loadingResources,
    refetch: refetchResourceList,
  } = useGetAllResourcesQuery();

  const [createEvents] = useCreateInternalEventMutation();

  const onSubmit = async () => {
    const response = await createEvents({ values: getValues() });

    console.log(response);
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
          <ControlledInput
            control={control}
            name={"summary"}
            label={"Summary"}
          />

          <ControlledInput
            control={control}
            name={"displayTitle"}
            label={"Display title"}
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
                    <View className="w-3/4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                      <Picker
                        selectedValue={value}
                        onBlur={onBlur}
                        onValueChange={(value) => {
                          onChange(value);
                        }}
                        dropdownIconColor={
                          colorScheme === "dark" ? "#FFF" : "#000"
                        }
                        style={{
                          color: colorScheme === "dark" ? "#FFF" : "#000",
                          backgroundColor:
                            colorScheme === "dark" ? "#1F2937" : "#FFF",
                        }}
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
            <Button title="log submit" onPress={onSubmit} />
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
