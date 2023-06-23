import { Input, Tooltip, Text, Flex } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useEnsAddress, useEnsName } from "wagmi";

const UserAddressInput: React.FC<{
  fieldName: string;
  id: string;
}> = ({ fieldName, id }) => {
  const form = useFormContext();
  const field = form.register(fieldName);
  const [input, setInput] = useState("");
  const {
    formState: { errors },
  } = form;

  const { data: ens } = useEnsName({
    address: input as `0x${string}`,
    chainId: 1,
    scopeKey: "wagmi",
  });

  const { data: address } = useEnsAddress({
    name: input,
    chainId: 1,
    scopeKey: "wagmi",
  });

  const handleChange = (e: any) => {
    field.onChange(e);
    setInput(e.target.value);
  };

  return (
    <>
      {ens ? (
        <Tooltip label={input}>
          <Input
            textColor={"white"}
            id={id}
            placeholder={"Contributor address 0x...."}
            {...field}
            onChange={handleChange}
            value={ens}
            w={"400px"}
          />
        </Tooltip>
      ) : (
        <Flex dir={"column"}>
          <Input
            id={id}
            textColor={"white"}
            placeholder={"Contributor address 0x...."}
            isInvalid={!ethers.isAddress(input)}
            {...field}
            onChange={handleChange}
            value={input}
            w={"400px"}
          />
          {errors[fieldName] && (
            <Text color="red.500" fontSize="sm">
              Invalid address or ENS name
            </Text>
          )}
        </Flex>
      )}
    </>
  );
};

export { UserAddressInput };
