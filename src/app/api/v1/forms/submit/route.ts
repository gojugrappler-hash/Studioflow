import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const { formId, orgId, data } = await req.json();
    if (!formId || !orgId || !data) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Use service role or anon key for public submissions
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Verify form exists and is active
    const { data: form, error: formErr } = await supabase
      .from('forms')
      .select('id, org_id, is_active')
      .eq('id', formId)
      .single();

    if (formErr || !form || !form.is_active) {
      return NextResponse.json({ error: 'Form not found or inactive' }, { status: 404 });
    }

    // Try to find or create a contact from email
    let contactId: string | null = null;
    const email = Object.values(data).find((v) => typeof v === 'string' && v.includes('@'));
    if (email) {
      const { data: existing } = await supabase
        .from('contacts')
        .select('id')
        .eq('org_id', orgId)
        .eq('email', email as string)
        .single();
      if (existing) {
        contactId = existing.id;
      } else {
        const name = Object.values(data).find((v) => typeof v === 'string' && !v.includes('@') && v.length > 1) as string || 'Unknown';
        const { data: newContact } = await supabase
          .from('contacts')
          .insert({ org_id: orgId, first_name: name, email: email as string, source: 'website', status: 'lead' })
          .select('id')
          .single();
        if (newContact) contactId = newContact.id;
      }
    }

    // Insert submission
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const sourceUrl = req.headers.get('referer') || null;
    const { error: subErr } = await supabase.from('form_submissions').insert({
      form_id: formId,
      org_id: orgId,
      contact_id: contactId,
      data,
      ip_address: ip,
      source_url: sourceUrl,
    });

    if (subErr) throw subErr;
    return NextResponse.json({ success: true, contactId });
  } catch (err) {
    console.error('Form submission error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}