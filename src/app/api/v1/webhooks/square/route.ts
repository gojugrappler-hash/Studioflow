import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-square-hmacsha256-signature');

    if (!process.env.SQUARE_WEBHOOK_SIGNATURE_KEY || !signature) {
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
    }

    // In production: verify signature using crypto.createHmac('sha256', signatureKey)
    //   .update(notificationUrl + body).digest('base64') === signature
    // Then parse the event type and handle:
    //   - payment.completed -> create payment record, update invoice to 'paid'
    //   - refund.created -> update payment record
    console.log('Square webhook received:', body.substring(0, 100));

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Square webhook error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
