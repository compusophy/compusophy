import { type ReactElement } from "react";
import { createConfig, http, WagmiProvider } from "wagmi";
import { base } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { farcasterFrame } from "@farcaster/frame-wagmi-connector";

/* eslint-disable sort-keys-fix/sort-keys-fix */
export const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  connectors: [farcasterFrame()],
});
/* eslint-enable sort-keys-fix/sort-keys-fix */

const queryClient = new QueryClient();

const Provider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): ReactElement => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </WagmiProvider>
);

export default Provider;
