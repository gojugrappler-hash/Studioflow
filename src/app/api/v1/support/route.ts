import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  // List tickets (admin use)
  return NextResponse.json({ data: [], error: null });
}

export async function POST(req: NextRequest) {
  try {
    const { subject, description, org_id, user_id } = await req.json();
    if (!subject || !description) {
      return NextResponse.json(
        { data: null, error: { message: 'subject and description required', code: 'MISSING_PARAM' } },
        { status: 400 }
      );
    }

    // In production: insert into support_tickets via Supabase server client
    return NextResponse.json({
      data: { message: 'Ticket created', subject, org_id, user_id },
      error: null,
    });
  } catch (err) {
    console.error('Support API error:', err);
    return NextResponse.json(
      { data: null, error: { message: 'Internal error', code: 'INTERNAL' } },
      { status: 500 }
    );
  }
}
