import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );
}

function isDeadlinePassed(deadline) {
  if (!deadline || deadline === 'Open' || deadline === 'Rolling') return false;
  const d = new Date(deadline.replace(/(\d+)(st|nd|rd|th)/gi, '$1'));
  if (isNaN(d.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit  = Math.min(parseInt(searchParams.get('limit')) || 20, 100);
    const type   = searchParams.get('type')  || 'All';
    const topic  = searchParams.get('topic') || 'All';
    const offset = parseInt(searchParams.get('offset')) || 0;

    const sb = getSupabase();
    let query = sb
      .from('opportunities')
      .select('*')
      .eq('is_approved', true)
      .order('fetched_at', { ascending: false })
      .limit(200);

    if (type  && type  !== 'All') query = query.eq('type', type);
    if (topic && topic !== 'All') query = query.eq('topic', topic);

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    // Filter out past-deadline
    const active = (data || []).filter(i => !isDeadlinePassed(i.deadline));

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
    console.error('GET /api/opportunities error:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, desc, description, url, provider, type, topic, deadline, amount, source, climate_score } = body;

    const resolvedTitle = title || description;
    if (!resolvedTitle) return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });

    const sb = getSupabase();
    const { data, error } = await sb
      .from('opportunities')
      .insert([{
        title: resolvedTitle.slice(0, 500),
        description: (desc || description || '').slice(0, 600),
        url: url || '',
        source: source || 'manual [Kenya]',
        provider: (provider || 'KYCH').slice(0, 200),
        type: type || 'Grant',
        topic: topic || 'Innovation',
        deadline: deadline || 'Open',
        amount: amount || null,
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
    console.error('POST /api/opportunities error:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
