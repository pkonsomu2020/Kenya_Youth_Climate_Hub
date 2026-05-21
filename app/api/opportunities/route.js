import { NextResponse } from 'next/server';
import { getOpportunities } from '@/lib/services/opportunityStorage';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// ── GET — fetch opportunities ─────────────────────────────────
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit  = Math.min(parseInt(searchParams.get('limit')) || 20, 100);
    const type   = searchParams.get('type')  || 'All';
    const topic  = searchParams.get('topic') || 'All';
    const page   = parseInt(searchParams.get('page')) || 1;
    const offset = parseInt(searchParams.get('offset')) || (page - 1) * limit;

    const items = await getOpportunities({ limit, type, topic, offset });
    return NextResponse.json({ success: true, data: items, meta: { count: items.length, limit, offset } });
  } catch (err) {
    console.error('GET /api/opportunities error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to fetch' }, { status: 500 });
  }
}

// ── POST — manually add an opportunity ───────────────────────
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, desc, description, url, provider, type, topic, deadline, amount, source, climate_score } = body;

    const resolvedTitle = title || description;
    if (!resolvedTitle) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });
    }

    const record = {
      title:         resolvedTitle.slice(0, 500),
      description:   (desc || description || '').slice(0, 600),
      url:           url || '',
      source:        source || 'manual [Kenya]',
      provider:      (provider || 'KYCH').slice(0, 200),
      type:          type || 'Grant',
      topic:         topic || 'Innovation',
      deadline:      deadline || 'Open',
      amount:        amount || null,
      climate_score: climate_score || 9.99,
      color:         '#059669',
      is_approved:   true,
      fetched_at:    new Date().toISOString(),
      scraped_at:    new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('opportunities')
      .insert([record])
      .select()
      .single();

    if (error) {
      console.error('POST /api/opportunities error:', error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    console.error('POST /api/opportunities error:', err.message);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
