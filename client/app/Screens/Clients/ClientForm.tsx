import { FC } from "react";
import { CreateClientDto, UpdateClientDto } from "@app/types";
import { useForm } from "react-hook-form";
import { ScrollView, TouchableOpacity, View, Text } from "react-native";
import { ControlledInput } from "@app/components/ControlledInput";
import { StatusPicker } from "@app/Screens/Clients/StatusPicker";
import { CustomButton } from "@app/components";

interface ClientFormProps {
  initialData?: UpdateClientDto;
  onSubmit: (data: CreateClientDto) => void | Promise<void>;
  submitLabel?: string;
}

const DEFAULT_VALUES: CreateClientDto = {
  name: "",
  surname: "",
  email: "",
  phone: "",
  notes: "",
  status: "pending",
};

const ClientForm: FC<ClientFormProps> = ({
  initialData,
  onSubmit,
  submitLabel,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateClientDto>({
    defaultValues: initialData || DEFAULT_VALUES,
  });

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <View className="p-4">
        {/* Basic Info */}
        <ControlledInput
          control={control}
          name="name"
          label="First Name"
          placeholder="John"
          rules={{
            required: "First name is required",
            minLength: { value: 2, message: "Minimum 2 characters" },
          }}
        />

        <ControlledInput
          control={control}
          name="surname"
          label="Last Name"
          placeholder="Doe"
          rules={{
            required: "Last name is required",
            minLength: { value: 2, message: "Minimum 2 characters" },
          }}
        />

        {/* Contact Info */}
        <ControlledInput
          control={control}
          name="email"
          label="Email"
          placeholder="john.doe@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          }}
        />

        <ControlledInput
          control={control}
          name="phone"
          label="Phone Number"
          placeholder="+48 123 456 789"
          keyboardType="phone-pad"
          rules={{
            required: "Phone number is required",
            pattern: {
              value:
                /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
              message: "Invalid phone number",
            },
          }}
        />

        <ControlledInput
          control={control}
          name="notes"
          label="Notes (Optional)"
          placeholder="Additional information about the client"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <StatusPicker control={control} name="status" label="Status" />

        <View className="mt-6">
          <CustomButton
            onPress={handleSubmit(onSubmit)}
            title={isSubmitting ? "Zapisywanie..." : submitLabel!}
            iconName={"plus"}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default ClientForm;
