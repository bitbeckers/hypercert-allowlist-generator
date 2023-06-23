"use client";

import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import * as React from "react";
import { WagmiConfig } from "wagmi";
import { ChakraProvider } from "@chakra-ui/react";

import { chains, config } from "../wagmi";

import { extendTheme } from "@chakra-ui/react";

// 2. Add your color mode config
const _chakraConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

// 3. extend the theme
const theme = extendTheme({ _chakraConfig });

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <ChakraProvider theme={theme}>
      <WagmiConfig config={config}>
        <RainbowKitProvider chains={chains}>
          {mounted && children}
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
}
