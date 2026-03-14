/**
 * Validate required and optional environment variables on startup.
 * Call this in the root layout or a server component.
 */
export function validateEnvironment() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ];

  const optional = [
    { key: 'SQUARE_ACCESS_TOKEN', feature: 'Square payments' },
    { key: 'SQUARE_WEBHOOK_SIGNATURE_KEY', feature: 'Square webhooks' },
    { key: 'RESEND_API_KEY', feature: 'Email sending' },
    { key: 'GOOGLE_CLIENT_ID', feature: 'Google Drive & Calendar' },
    { key: 'GOOGLE_CLIENT_SECRET', feature: 'Google Drive & Calendar' },
    { key: 'GEMINI_API_KEY', feature: 'AI features' },
    { key: 'SENTRY_DSN', feature: 'Error tracking' },
    { key: 'NEXT_PUBLIC_TAWKTO_PROPERTY_ID', feature: 'Live chat' },
    { key: 'FIREBASE_SERVER_KEY', feature: 'Push notifications' },
  ];

  const missing: string[] = [];
  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    console.error(`[Studioflow] Missing REQUIRED env vars: ${missing.join(', ')}`);
  }

  for (const { key, feature } of optional) {
    if (!process.env[key]) {
      console.warn(`[Studioflow] ${key} not set — ${feature} disabled`);
    }
  }
}
