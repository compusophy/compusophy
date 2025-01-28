import { createContext, useContext, useEffect, useState, type ReactNode, type ReactElement } from "react";
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
    const initFrame = async (): Promise<void> => {
      try {
        const context = await sdk.context;
        console.info("Frame context initialized:", {
          fid: context.user.fid,
          username: context.user.username,
          hasNotifications: !!context.client.notificationDetails
        });

        setFrameContext(context);

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
      } catch (error) {
        console.error("Failed to initialize frame:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (typeof window !== "undefined") {
      void initFrame();
      return () => {
        sdk.removeAllListeners();
      };
    }
    setIsLoading(false);
    return undefined;
  }, []);

  return (
    <FrameContext.Provider value={{ frameContext, isLoading }}>
      {children}
    </FrameContext.Provider>
  );
};

export const useFrame = (): FrameContextType => {
  const context = useContext(FrameContext);
  if (context === undefined) {
    throw new Error("useFrame must be used within a FrameProvider");
  }
  return context;
}; 