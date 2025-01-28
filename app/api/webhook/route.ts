/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable unicorn/catch-error-name */
/* eslint-disable typescript-sort-keys/interface */
/* eslint-disable default-case */
import {
  parseWebhookEvent,
  verifyAppKeyWithNeynar,
} from "@farcaster/frame-node";
import { type NextRequest } from "next/server";
import {
  deleteUserNotificationDetails,
  setUserNotificationDetails,
} from "@/lib/kv";
import { sendFrameNotification } from "@/lib/notifs";

export async function POST(request: NextRequest): Promise<Response> {
  const requestJson = await request.json();

  let data;
  try {
    data = await parseWebhookEvent(requestJson, verifyAppKeyWithNeynar);
  } catch (e: unknown) {
    const error = e as { 
      name: "VerifyJsonFarcasterSignature.InvalidDataError" | 
            "VerifyJsonFarcasterSignature.InvalidEventDataError" |
            "VerifyJsonFarcasterSignature.InvalidAppKeyError" |
            "VerifyJsonFarcasterSignature.VerifyAppKeyError";
      message: string;
    };

    switch (error.name) {
      case "VerifyJsonFarcasterSignature.InvalidDataError":
      case "VerifyJsonFarcasterSignature.InvalidEventDataError":
        return Response.json(
          { error: error.message, success: false },
          { status: 400 }
        );
      case "VerifyJsonFarcasterSignature.InvalidAppKeyError":
        return Response.json(
          { error: error.message, success: false },
          { status: 401 }
        );
      case "VerifyJsonFarcasterSignature.VerifyAppKeyError":
        return Response.json(
          { error: error.message, success: false },
          { status: 417 }
        );
    }
  }

  const { fid, event } = data;

  async function handleNotification(
    title: string,
    body: string
  ): Promise<Response | undefined> {
    const result = await sendFrameNotification({ body, fid, title });
    switch (result.state) {
      case "error":
        return Response.json(
          { error: result.error, success: false },
          { status: 500 }
        );
      case "rate_limit":
        return Response.json(
          { error: "Rate limited", success: false },
          { status: 429 }
        );
      case "no_token":
        return Response.json(
          { error: "No notification token found", success: false },
          { status: 400 }
        );
      case "success":
        return undefined;
      default:
        return Response.json(
          { error: "Unknown notification state", success: false },
          { status: 500 }
        );
    }
  }

  let notificationResult: Response | undefined;

  switch (event.event) {
    case "frame_added":
      if (event.notificationDetails) {
        await setUserNotificationDetails(fid, event.notificationDetails);
        notificationResult = await handleNotification(
          "Welcome to compusophy",
          "Frame is now added to your client"
        );
        if (notificationResult) return notificationResult;
      } else {
        await deleteUserNotificationDetails(fid);
      }
      break;

    case "frame_removed":
      await deleteUserNotificationDetails(fid);
      break;

    case "notifications_enabled":
      await setUserNotificationDetails(fid, event.notificationDetails);
      notificationResult = await handleNotification(
        "Ding ding ding",
        "Notifications are now enabled"
      );
      if (notificationResult) return notificationResult;
      break;

    case "notifications_disabled":
      await deleteUserNotificationDetails(fid);
      break;

    default:
      return Response.json(
        { error: "Unknown event", success: false },
        { status: 400 }
      );
  }

  return Response.json({ success: true });
}
