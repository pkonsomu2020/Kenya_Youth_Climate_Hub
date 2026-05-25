import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );
}

function isEventPast(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit  = Math.min(parseInt(searchParams.get('limit')) || 20, 100);
    const type   = searchParams.get('type')   || 'All';
    const format = searchParams.get('format') || 'All';
    const offset = parseInt(searchParams.get('offset')) || 0;

    const sb = getSupabase();
    let query = sb
      .from('events_live')
      .select('*')
      .eq('is_approved', true)
      .order('fetched_at', { ascending: false })
      .limit(200);

    if (type   && type   !== 'All') query = query.eq('event_type', type);
    if (format && format !== 'All') query = query.eq('format', format);

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    // Filter out past events
    const active = (data || []).filter(i => !isEventPast(i.event_date));

    // 70/30 Kenya/Global mix
    const kenya  = active.filter(i => i.source?.includes('[Kenya]') || i.source?.includes('[Africa]'));
    const global = active.filter(i => !i.source?.includes('[Kenya]') && !i.source?.includes('[Africa]'));
    const mixed  = [];
    let k = 0, g = 0;
    while (k < kenya.length || g < global.length) {
      for (let i = 0; i < 7 && k < kenya.length; i++) mixed.push(kenya[k++]);
      for (let i = 0; i < 3 && g < global.length; i++) mixed.push(global[g++]);
    }
    const items = mixed.slice(offset, offset + limit);

    return NextResponse.json({ success: true, data: items, meta: { count: items.length, limit, offset } });
  } catch (err) {
    console.error('GET /api/events error:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, url, event_type, format, event_date, location, topic, source, climate_score } = body;

    if (!title) return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });

    const sb = getSupabase();
    const { data, error } = await sb
      .from('events_live')
      .insert([{
        title: title.slice(0, 500),
        description: (description || '').slice(0, 600),
        url: url || '',
        source: source || 'manual [Kenya]',
        event_type: event_type || 'Workshop',
        format: format || 'In-person',
        event_date: event_date || null,
        location: (location || 'Nairobi, Kenya').slice(0, 200),
        topic: topic || 'Innovation',
        climate_score: climate_score || 9.99,
        color: '#059669',
        is_approved: true,
        fetched_at: new Date().toISOString(),
        scraped_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    console.error('POST /api/events error:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
