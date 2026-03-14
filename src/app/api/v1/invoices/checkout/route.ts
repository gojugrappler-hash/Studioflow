import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { invoice_id } = await req.json();
    if (!invoice_id) {
      return NextResponse.json({ data: null, error: { message: 'invoice_id required', code: 'MISSING_PARAM' } }, { status: 400 });
    }

    // Check if Square is configured
    if (!process.env.SQUARE_ACCESS_TOKEN) {
      return NextResponse.json({ data: null, error: { message: 'Square not configured', code: 'SQUARE_NOT_CONFIGURED' } }, { status: 503 });
    }

    // In production, fetch invoice from Supabase and create Square Checkout payment link
    // Docs: https://developer.squareup.com/reference/square/checkout-api/create-payment-link
    return NextResponse.json({
      data: { message: 'Square Checkout payment link would be created here', invoice_id },
      error: null,
    });
  } catch (err) {
    console.error('Checkout error:', err);
    return NextResponse.json({ data: null, error: { message: 'Internal error', code: 'INTERNAL' } }, { status: 500 });
  }
}
