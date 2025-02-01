import { createContext, useContext, useEffect, useMemo, useState, type ReactNode, type ReactElement } from "react";
import sdk, { type Context } from "@farcaster/frame-sdk";

interface FrameContextType {
  frameContext: Context.FrameContext | undefined;
  isLoading: boolean;
}

const FrameContext = createContext<FrameContextType>({
  frameContext: undefined,
  isLoading: true,
});

export const FrameProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [frameContext, setFrameContext] = useState<Context.FrameContext>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initFrame = async (): Promise<undefined> => {
      let result: undefined;
      try {
        const context = await sdk.context;
        
        // If context or context.user is undefined, use default values
        const effectiveContext = context?.user ? context : {
          user: {
            fid: 350911,
            username: 'compusophy',
          },
          client: {
            notificationDetails: undefined
          }
        };

        console.info("Frame context initialized:", {
          fid: effectiveContext.user.fid,
          username: effectiveContext.user.username,
          hasNotifications: Boolean(effectiveContext.client.notificationDetails)
        });

        setFrameContext(effectiveContext as Context.FrameContext);

        sdk.on("frameAdded", ({ notificationDetails }) => {
          console.info("Frame added, notification details:", notificationDetails);
          setFrameContext((prev) => 
            prev ? { ...prev, client: { ...prev.client, notificationDetails } } : prev
          );
        });

        sdk.on("notificationsEnabled", ({ notificationDetails }) => {
          console.info("Notifications enabled:", notificationDetails);
          setFrameContext((prev) => 
            prev ? { ...prev, client: { ...prev.client, notificationDetails } } : prev
          );
        });

        sdk.on("notificationsDisabled", () => {
          console.info("Notifications disabled");
          setFrameContext((prev) => 
            prev ? { ...prev, client: { ...prev.client, notificationDetails: undefined } } : prev
          );
        });

        sdk.actions.ready();
        result = undefined;
      } catch (error) {
        console.error("Failed to initialize frame:", error);
        setFrameContext({
          user: {
            fid: 350911,
            username: 'compusophy',
          },
          client: {
            notificationDetails: undefined
          }
        } as Context.FrameContext);
        result = undefined;
      } finally {
        setIsLoading(false);
      }
      return result;
    };

    if (typeof window !== "undefined") {
      initFrame().catch(console.error);
      return () => {
        sdk.removeAllListeners();
      };
    }
    setIsLoading(false);
    return undefined;
  }, []);

  const contextValue = useMemo(() => ({
    frameContext,
    isLoading
  }), [frameContext, isLoading]);

  return (
    <FrameContext.Provider value={contextValue}>
      {children}
    </FrameContext.Provider>
  );
};

export const useFrame = (): FrameContextType => {
  const context = useContext(FrameContext);
  if (!context) {
    throw new Error("useFrame must be used within a FrameProvider");
  }
  return context;
}; 