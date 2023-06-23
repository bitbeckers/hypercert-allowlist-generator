import { Text, Input } from "@chakra-ui/react";
import { FieldValues, RegisterOptions, useFormContext } from "react-hook-form";

type TextInputProps = {
  fieldName: string;
  placeholder: string;
  config?: RegisterOptions<FieldValues, string>;
};

const TextInput: React.FC<TextInputProps> = ({
  fieldName,
  placeholder,
  config,
}) => {
  const form = useFormContext();
  const field = form.register(fieldName, config);
  const {
    formState: { errors },
  } = form;

  return (
    <>
      <Input
        id={fieldName}
        mb={"1em"}
        placeholder={placeholder}
        {...field}
      />
      {errors[fieldName] && (
        <Text color="red.500" fontSize="sm">
          {`${fieldName} is required`}
        </Text>
      )}
    </>
  );
};

export default TextInput;
