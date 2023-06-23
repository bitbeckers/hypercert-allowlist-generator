"use client";

import { Button, ButtonGroup, Spacer, Text } from "@chakra-ui/react";
import { useNetwork, useSwitchNetwork } from "wagmi";

export function NetworkSwitcher() {
  const { chain } = useNetwork();
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();

  return (
    <>
      <Text>
        Connected to {chain?.name ?? chain?.id}
        {chain?.unsupported && " (unsupported)"}
      </Text>
      <Spacer />
      {switchNetwork && (
        <>
          <Text>Switch to:</Text>
          <ButtonGroup>
            {chains.map((x) =>
              x.id === chain?.id ? null : (
                <Button
                  key={x.id}
                  onClick={() => switchNetwork(x.id)}
                  colorScheme="yellow"
                >
                  {x.name}
                  {isLoading && x.id === pendingChainId && " (switching)"}
                </Button>
              )
            )}
          </ButtonGroup>
        </>
      )}

      <div>{error?.message}</div>
    </>
  );
}
