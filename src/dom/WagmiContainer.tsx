"use client";

import {
  configureChains,
  createConfig,
  WagmiConfig,
} from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { PhantomConnector } from 'phantom-wagmi-connector';
import { goerli } from 'wagmi/chains'


// =============================================================================
// wagmi configuration
// =============================================================================
// initalize which chains your dapp will use, and set up a provider
// @ts-ignore
// console.log("window.phantom?.solana", window.phantom?.solana)
const qwe = configureChains([goerli], [publicProvider()]);
// const qwe = configureChains([window.phantom?.solana], [publicProvider()]);

const wagmiConfig = !qwe ? null : createConfig({
  publicClient: qwe.publicClient,
  webSocketPublicClient: qwe.webSocketPublicClient,
  connectors: [
    new PhantomConnector({ chains: qwe.chains }),
  ]
});



export const WagmiContainer = ({children}:any) => {
  if (!wagmiConfig) return (<></>)
    return (<>
<WagmiConfig config={wagmiConfig}>
        {children}
      </WagmiConfig>
    </>)
}