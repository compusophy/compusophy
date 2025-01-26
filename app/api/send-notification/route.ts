import { type NextRequest } from "next/server";
import { z } from "zod";
import { setUserNotificationDetails } from "@/lib/kv";
import { sendFrameNotification } from "@/lib/notifs";

const notificationDetailsSchema = z.object({
  token: z.string(),
  url: z.string().url(),
});

const requestSchema = z.object({
  fid: z.number(),
  notificationDetails: notificationDetailsSchema,
});

export async function POST(request: NextRequest): Promise<Response> {
  const requestJson = (await request.json()) as unknown;
  const requestBody = requestSchema.safeParse(requestJson);

  if (!requestBody.success) {
    return Response.json(
      {
        error: "Invalid request body",
        errors: requestBody.error.errors,
        success: false,
      },
      { status: 400 }
    );
  }

  await setUserNotificationDetails(
    requestBody.data.fid,
    requestBody.data.notificationDetails
  );

  const sendResult = await sendFrameNotification({
    body: `Sent at ${new Date().toISOString()}`,
    fid: requestBody.data.fid,
    title: "Test notification",
  });

  switch (sendResult.state) {
    case "error":
      return Response.json(
        { error: sendResult.error, success: false },
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
      return Response.json({ success: true });
    default:
      return Response.json(
        { error: "Unknown notification state", success: false },
        { status: 500 }
      );
  }
}
