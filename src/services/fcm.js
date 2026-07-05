import { messaging, getToken, deleteToken, onMessage } from "../firebase";
import { ENV } from "../config/env";

const VAPID_KEY = "BIW_7Hlvhrse23s3FO4TJoXAa1HhpSXCXSgzv9rvvjrNcCqiC5JcG0fG6Pq8AdY_o-5Q0s72sI8THqZj12cAi58";

export async function registerFCM(jwtToken) {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    console.warn("Notification permission denied");
    return null;
  }

  const fcmToken = await getToken(messaging, { vapidKey: VAPID_KEY });

  await fetch(`${ENV.API_BASE_URL}/api/notifications/register-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`,
    },
    body: JSON.stringify({ fcmToken }),
  });

  localStorage.setItem("fcm_subscribed", "true");
  localStorage.removeItem("notification_popup_dismissed");
  return fcmToken;
}

export async function unregisterFCM(jwtToken) {
  try {
    await fetch(`${ENV.API_BASE_URL}/api/notifications/register-token`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
  } catch (e) {
    console.error("Failed to unregister FCM token on server:", e);
  }

  try {
    await deleteToken(messaging);
  } catch (e) {
    console.error("Failed to delete FCM token:", e);
  }

  localStorage.removeItem("fcm_subscribed");
  localStorage.removeItem("notification_popup_dismissed");
}

export function onForegroundMessage(callback) {
  return onMessage(messaging, callback);
}
