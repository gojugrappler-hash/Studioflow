/**
 * Firebase Cloud Messaging (FCM) Integration
 * 
 * Provides push notification registration and sending.
 * Requires: FIREBASE_SERVER_KEY environment variable.
 * 
 * Status: SCAFFOLD — not active until Firebase project is configured.
 */

interface PushNotification {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, string>;
  clickAction?: string;
}

interface FCMResponse {
  success: number;
  failure: number;
  results: { message_id?: string; error?: string }[];
}

const FCM_API = 'https://fcm.googleapis.com/fcm/send';

function getServerKey(): string {
  const key = process.env.FIREBASE_SERVER_KEY;
  if (!key) throw new Error('FCM not configured — set FIREBASE_SERVER_KEY environment variable');
  return key;
}

export function isFCMConfigured(): boolean {
  return !!process.env.FIREBASE_SERVER_KEY;
}

export async function sendPush(
  deviceToken: string,
  notification: PushNotification
): Promise<FCMResponse> {
  const serverKey = getServerKey();
  const res = await fetch(FCM_API, {
    method: 'POST',
    headers: {
      Authorization: `key=${serverKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: deviceToken,
      notification: {
        title: notification.title,
        body: notification.body,
        icon: notification.icon || '/icons/icon-192.svg',
        badge: notification.badge || '/icons/icon-72.svg',
        click_action: notification.clickAction,
      },
      data: notification.data,
    }),
  });
  if (!res.ok) throw new Error('FCM send failed');
  return res.json();
}

export async function sendPushToMultiple(
  deviceTokens: string[],
  notification: PushNotification
): Promise<FCMResponse> {
  const serverKey = getServerKey();
  const res = await fetch(FCM_API, {
    method: 'POST',
    headers: {
      Authorization: `key=${serverKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      registration_ids: deviceTokens,
      notification: {
        title: notification.title,
        body: notification.body,
        icon: notification.icon || '/icons/icon-192.svg',
      },
      data: notification.data,
    }),
  });
  if (!res.ok) throw new Error('FCM batch send failed');
  return res.json();
}

// Topic-based push (e.g., org-wide announcements)
export async function sendToTopic(
  topic: string,
  notification: PushNotification
): Promise<FCMResponse> {
  const serverKey = getServerKey();
  const res = await fetch(FCM_API, {
    method: 'POST',
    headers: {
      Authorization: `key=${serverKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: `/topics/${topic}`,
      notification: {
        title: notification.title,
        body: notification.body,
        icon: notification.icon || '/icons/icon-192.svg',
      },
      data: notification.data,
    }),
  });
  if (!res.ok) throw new Error('FCM topic send failed');
  return res.json();
}
