'use client'

import {
  Flex,
  Heading,
  Spacer,
  GridItem,
  Grid,
} from "@chakra-ui/react";
import { Account } from "../components/Account";
import AllowlistForm from "../components/AllowlistForm";
import { ConnectButton } from "../components/ConnectButton";
import { Connected } from "../components/Connected";
import { NetworkSwitcher } from "../components/NetworkSwitcher";

export default function Page() {
  return (
    <>
      <Flex dir={"row"} w={"100%"} p={"1em"}>
        <Heading>Hypercert allowlist creator</Heading>
        <Spacer />
        <ConnectButton />
      </Flex>

      <Connected>
        <Grid
          maxW={"750px"}
          templateAreas={`"user  network"
                  "user  network"
                  `}
          gap="2"
          fontWeight="bold"
          padding={"2em"}
        >
          <GridItem gridArea="user">
            <Account />
          </GridItem>
          <GridItem gridArea="network">
            <NetworkSwitcher />
          </GridItem>
        </Grid>

          <Heading>Allowlist</Heading>
          <AllowlistForm />
      </Connected>
    </>
  );
}

// export default Page;
