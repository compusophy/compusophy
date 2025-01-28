import { type AppProps } from "next/app";
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

const FrameProvider = dynamic(
  () => import("contexts/frame").then((mod) => mod.FrameProvider),
  { ssr: false }
);

const App = ({ Component, pageProps }: AppProps): React.ReactElement => (
  <WagmiProvider>
    <ViewportProvider>
      <FrameProvider>
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
      </FrameProvider>
    </ViewportProvider>
  </WagmiProvider>
);

export default App;
