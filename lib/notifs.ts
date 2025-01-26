import {
  type SendNotificationRequest,
  sendNotificationResponseSchema,
} from "@farcaster/frame-sdk";
import { getUserNotificationDetails } from "@/lib/kv";

const appUrl = process.env.NEXT_PUBLIC_URL || "";

type SendFrameNotificationResult =
  | {
      error: unknown;
      state: "error";
    }
  | { state: "no_token" }
  | { state: "rate_limit" }
  | { state: "success" };

export async function sendFrameNotification({
  body,
  fid,
  title,
}: {
  body: string;
  fid: number;
  title: string;
}): Promise<SendFrameNotificationResult> {
  const notificationDetails = await getUserNotificationDetails(fid);
  if (!notificationDetails) {
    return { state: "no_token" };
  }

  const response = await fetch(notificationDetails.url, {
    body: JSON.stringify({
      body,
      notificationId: crypto.randomUUID(),
      targetUrl: appUrl,
      title,
      tokens: [notificationDetails.token],
    } satisfies SendNotificationRequest),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  const responseJson = (await response.json()) as unknown;

  if (response.status === 200) {
    const responseBody = sendNotificationResponseSchema.safeParse(responseJson);
    if (!responseBody.success) {
      // Malformed response
      return { error: responseBody.error.errors, state: "error" };
    }

    if (responseBody.data.result.rateLimitedTokens.length > 0) {
      // Rate limited
      return { state: "rate_limit" };
    }

    return { state: "success" };
  }

  // Error response
  return { error: responseJson, state: "error" };
}
