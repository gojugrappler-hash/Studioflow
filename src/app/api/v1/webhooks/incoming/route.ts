import { NextRequest, NextResponse } from 'next/server';

// Public endpoint - no auth required (per project spec)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = body.event || 'unknown';
    const payload = body.payload || {};

    console.log('[Webhook Incoming]', event, payload);

    // In production:
    // 1. Match event to automations with trigger_type = 'webhook_received'
    // 2. Filter by trigger_config matching the event type
    // 3. Queue automation execution for each match
    // 4. Log the webhook receipt

    return NextResponse.json({
      data: { received: true, event, timestamp: new Date().toISOString() },
      error: null,
    });
  } catch (err) {
    console.error('Webhook incoming error:', err);
    return NextResponse.json(
      { data: null, error: { message: 'Internal error', code: 'INTERNAL' } },
      { status: 500 }
    );
  }
}
