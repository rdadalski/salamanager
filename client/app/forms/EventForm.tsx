import { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { TextInput, View, Text, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { IInternalEvent } from "@app/types";
import { FullscreenModal } from "@app/components/CustomModal";
import { ResourceForm } from "@app/forms/ResourceForm";

interface EventFormProps {
  googleEventId: string;
  calendarId: string;
  summary: string;
  displayTitle?: string;
  startTime: string;
  endTime: string;
}

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
  } = useForm({
    defaultValues: {
      resourceId: "", // picker
      status: "", // picker
      defaultResourcePrice: 0, // num
      clients: [], // multi picker
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

  const onSubmit = (data: IInternalEvent) => {
    console.log(data);
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

      <View className="mt-2">
        <Button
          title="Show resource form modal "
          onPress={handlePopUp}
          color="#3b82f6"
        />
      </View>
      <FullscreenModal
        component={ResourceForm}
        onClose={() => setModalVisible(false)}
        visible={modalVisible}
      ></FullscreenModal>
    </View>
  );
};
