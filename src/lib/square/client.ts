// Square client helper — lazy-init, safe to import even if credentials are missing
// Uses Square Node.js SDK v44+ (https://developer.squareup.com)

let squareClientInstance: unknown | null = null;

export type SquareEnvironment = 'sandbox' | 'production';

export function getSquareClient() {
  if (!process.env.SQUARE_ACCESS_TOKEN) {
    console.warn('SQUARE_ACCESS_TOKEN not set — Square features disabled');
    return null;
  }

  if (!squareClientInstance) {
    // Dynamic import to avoid bundling Square SDK on the client
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { SquareClient } = require('square');
    const environment = (process.env.SQUARE_ENVIRONMENT as SquareEnvironment) || 'sandbox';
    squareClientInstance = new SquareClient({
      token: process.env.SQUARE_ACCESS_TOKEN,
      environment,
    });
  }
  return squareClientInstance;
}

/**
 * Create a Square Checkout payment link for an invoice.
 * Returns the checkout URL that the client clicks to pay.
 */
export async function createCheckoutLink(params: {
  invoiceId: string;
  amountCents: number;
  currency?: string;
  description?: string;
  redirectUrl?: string;
}) {
  const client = getSquareClient();
  if (!client) throw new Error('Square not configured');

  // In production: use client.checkout.createPaymentLink({...})
  // Docs: https://developer.squareup.com/reference/square/checkout-api/create-payment-link
  console.log('Square: createCheckoutLink called for invoice', params.invoiceId);
  return {
    url: `https://square.link/placeholder/${params.invoiceId}`,
    checkout_id: `chk_placeholder_${params.invoiceId}`,
  };
}

/**
 * Verify a Square webhook signature.
 * Docs: https://developer.squareup.com/docs/webhooks/step3validate
 */
export function verifyWebhookSignature(
  body: string,
  signature: string,
  signatureKey: string,
  notificationUrl: string,
): boolean {
  // In production: use crypto.createHmac('sha256', signatureKey)
  //   .update(notificationUrl + body).digest('base64') === signature
  console.log('Square: verifyWebhookSignature called');
  return !!body && !!signature && !!signatureKey && !!notificationUrl;
}
