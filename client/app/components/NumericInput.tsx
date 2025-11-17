import { ControlledInput } from "@app/components/ControlledInput";
import { Control, FieldValues, Path } from "react-hook-form";

interface NumericInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  min?: number;
  max?: number;
  allowDecimal?: boolean;
  disabled?: boolean;
}

export const NumericInput = <T extends FieldValues>({
  control,
  name,
  label,
  min,
  max,
  allowDecimal = false,
}: NumericInputProps<T>) => {
  const formatNumeric = (text: string): string => {
    let cleaned = text.replace(allowDecimal ? /[^0-9.]/g : /[^0-9]/g, "");

    if (allowDecimal) {
      const parts = cleaned.split(".");
      if (parts.length > 2) {
        cleaned = parts[0] + "." + parts.slice(1).join("");
      }
    }

    return cleaned;
  };

  return (
    <ControlledInput
      control={control}
      name={name}
      label={label}
      keyboardType={allowDecimal ? "decimal-pad" : "number-pad"}
      transform={{
        input: (value) => value?.toString() ?? "",
        output: (text) => {
          const formatted = formatNumeric(text);
          return formatted ? Number(formatted) : "";
        },
      }}
      rules={{
        validate: (value: any) => {
          if (!value && value !== 0) return true;
          const num = Number(value);
          if (isNaN(num)) return "Must be a number";
          if (min !== undefined && num < min) return `Min: ${min}`;
          if (max !== undefined && num > max) return `Max: ${max}`;
          return true;
        },
      }}
    />
  );
};
