import { FC } from "react";
import { View, Text, ScrollView } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { CustomButton } from "@app/components";
import { MultiSelectComponent } from "@app/components/CustomMultiselect";
import { useGetUsersQuery } from "@app/api/users/usersApi";
import { useCreateResourceMutation } from "@app/api/resource/resource.api";
import { ControlledInput } from "@app/components/ControlledInput";

type ResourceFormValues = {
  name: string;
  defaultPrice: number | string;
  ownerId: string;
  minTimeBox: string;
  clients: string[];
};

export const ResourceForm: FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm<ResourceFormValues>({
    defaultValues: {
      name: "",
      defaultPrice: "0",
      ownerId: "string",
      minTimeBox: "string",
      clients: [],
    },
  });

  const { data: userList, isLoading: userListLoading } = useGetUsersQuery();

  console.log(userList);

  const [createResource] = useCreateResourceMutation();

  const onSubmit = async () => {
    const formValues = getValues();
    const values = { ...formValues, defaultPrice: +formValues.defaultPrice };

    const response = await createResource({ values: values });
  };

  return (
    <ScrollView className="flex w-full bg-white dark:bg-gray-900">
      <View className="mb-6">
        <ControlledInput control={control} name={"name"} label={"Name"} />
        <ControlledInput
          control={control}
          name={"defaultPrice"}
          label={"Default price"}
        />
        <ControlledInput
          control={control}
          name={"ownerId"}
          label={"Owner id"}
        />
        <ControlledInput
          control={control}
          name={"minTimeBox"}
          label={"Time box"}
        />

        <Controller
          control={control}
          rules={{ required: "name is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="mb-4 w-full">
              <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                Select Users - multipick
              </Text>
              <MultiSelectComponent onChange={onChange} data={userList!} />
            </View>
          )}
          name="clients"
        />

        {/* Submit Button */}
        <CustomButton title={"submit"} onPress={onSubmit} iconName={"plus"} />
      </View>
    </ScrollView>
  );
};
