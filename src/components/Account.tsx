"use client";

import { Flex, Text } from "@chakra-ui/react";
import { useAccount, useEnsName } from "wagmi";

export function Account() {
  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address });

  return (
    <>
      <Text fontSize={"xl"}> {ensName ?? address}</Text>
      <Text fontSize={"md"}> {ensName ? ` (${address})` : null}</Text>
    </>
  );
}
