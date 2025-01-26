import { type FrameNotificationDetails } from "@farcaster/frame-sdk";
import { ref, get, set, remove } from "firebase/database";
import { db } from "@/lib/firebase";

function getUserNotificationDetailsKey(fid: number): string {
  return `frames-v2-demo/users/${fid}`;
}

export async function getUserNotificationDetails(
  fid: number
): Promise<FrameNotificationDetails | null> {
  const snapshot = await get(ref(db, getUserNotificationDetailsKey(fid)));
  return snapshot.val() as FrameNotificationDetails | null;
}

export async function setUserNotificationDetails(
  fid: number,
  notificationDetails: FrameNotificationDetails
): Promise<void> {
  await set(ref(db, getUserNotificationDetailsKey(fid)), notificationDetails);
}

export async function deleteUserNotificationDetails(
  fid: number
): Promise<void> {
  await remove(ref(db, getUserNotificationDetailsKey(fid)));
}
