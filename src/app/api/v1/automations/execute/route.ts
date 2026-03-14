import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { automation_id, trigger_data } = await req.json();

    if (!automation_id) {
      return NextResponse.json(
        { data: null, error: { message: 'automation_id required', code: 'MISSING_PARAM' } },
        { status: 400 }
      );
    }

    // In production: fetch automation + steps from Supabase, run engine, log results
    // For now, return a placeholder acknowledging the execution request
    return NextResponse.json({
      data: {
        message: 'Automation execution queued',
        automation_id,
        trigger_data: trigger_data || {},
      },
      error: null,
    });
  } catch (err) {
    console.error('Automation execute error:', err);
    return NextResponse.json(
      { data: null, error: { message: 'Internal error', code: 'INTERNAL' } },
      { status: 500 }
    );
  }
}
