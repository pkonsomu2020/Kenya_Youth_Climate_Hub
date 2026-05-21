import { NextResponse } from 'next/server';
import { getEvents } from '@/lib/services/eventStorage';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// ── GET — fetch events ────────────────────────────────────────
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit  = Math.min(parseInt(searchParams.get('limit')) || 20, 100);
    const type   = searchParams.get('type')   || 'All';
    const format = searchParams.get('format') || 'All';
    const page   = parseInt(searchParams.get('page')) || 1;
    const offset = parseInt(searchParams.get('offset')) || (page - 1) * limit;

    const items = await getEvents({ limit, type, format, offset });
    return NextResponse.json({ success: true, data: items, meta: { count: items.length, limit, offset } });
  } catch (err) {
    console.error('GET /api/events error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to fetch' }, { status: 500 });
  }
}

// ── POST — manually add an event ─────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, url, event_type, format, event_date, location, topic, source, climate_score } = body;

    if (!title) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });
    }

    const record = {
      title:        title.slice(0, 500),
      description:  (description || '').slice(0, 600),
      url:          url || '',
      source:       source || 'manual [Kenya]',
      event_type:   event_type || 'Workshop',
      format:       format || 'In-person',
      event_date:   event_date || null,
      location:     (location || 'Nairobi, Kenya').slice(0, 200),
      topic:        topic || 'Innovation',
      climate_score: climate_score || 9.99,
      color:        '#059669',
      is_approved:  true,
      fetched_at:   new Date().toISOString(),
      scraped_at:   new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('events_live')
      .insert([record])
      .select()
      .single();

    if (error) {
      console.error('POST /api/events error:', error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    console.error('POST /api/events error:', err.message);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
