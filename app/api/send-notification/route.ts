import { notificationDetailsSchema } from "@farcaster/frame-sdk";
import { type NextRequest } from "next/server";
import { z } from "zod";
import { setUserNotificationDetails } from "~/lib/kv";
import { sendFrameNotification } from "~/lib/notifs";

const requestSchema = z.object({
  fid: z.number(),
  notificationDetails: notificationDetailsSchema,
}) satisfies z.ZodType<{
  fid: number;
  notificationDetails: z.infer<typeof notificationDetailsSchema>;
}>;

export async function POST(request: NextRequest): Promise<Response> {
  const requestJson = await request.json() as unknown;
  const requestBody = requestSchema.safeParse(requestJson);

  if (!requestBody.success) {
    return Response.json(
      { errors: requestBody.error.errors, success: false },
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

  if (sendResult.state === "error") {
    return Response.json(
      { error: sendResult.error, success: false },
      { status: 500 }
    );
  }
  
  if (sendResult.state === "rate_limit") {
    return Response.json(
      { error: "Rate limited", success: false },
      { status: 429 }
    );
  }

  return Response.json({ success: true });
}
