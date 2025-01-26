import { type AppProps } from "next/app";
import { useEffect } from "react";
import sdk from "@farcaster/frame-sdk";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "components/pages/ErrorBoundary";
import StyledApp from "components/pages/StyledApp";
import { FileSystemProvider } from "contexts/fileSystem";
import { MenuProvider } from "contexts/menu";
import { ProcessProvider } from "contexts/process";
import { SessionProvider } from "contexts/session";
import { ViewportProvider } from "contexts/viewport";

const WagmiProvider = dynamic(
  () => import("components/providers/WagmiProvider"),
  { ssr: false }
);

const App = ({ Component, pageProps }: AppProps): React.ReactElement => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      sdk.actions.ready();
    }
  }, []);

  return (
    <WagmiProvider>
      <ViewportProvider>
        <ProcessProvider>
          <FileSystemProvider>
            <SessionProvider>
              <ErrorBoundary>
                <StyledApp>
                  <MenuProvider>
                    <Component {...pageProps} />
                  </MenuProvider>
                </StyledApp>
              </ErrorBoundary>
            </SessionProvider>
          </FileSystemProvider>
        </ProcessProvider>
      </ViewportProvider>
    </WagmiProvider>
  );
};

export default App;
