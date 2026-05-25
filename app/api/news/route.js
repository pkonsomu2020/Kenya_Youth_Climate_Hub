import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit    = Math.min(parseInt(searchParams.get('limit')) || 20, 100);
    const category = searchParams.get('category') || searchParams.get('type') || 'All';
    const offset   = parseInt(searchParams.get('offset')) || 0;

    const sb = getSupabase();
    let query = sb
      .from('news_articles')
      .select('*')
      .eq('is_approved', true)
      .order('published_at', { ascending: false })
      .limit(200);

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    // 70/30 Kenya/Global mix
    const kenya  = (data || []).filter(i => i.source?.includes('[Kenya]') || i.source?.includes('[Africa]'));
    const global = (data || []).filter(i => !i.source?.includes('[Kenya]') && !i.source?.includes('[Africa]'));
    const mixed  = [];
    let k = 0, g = 0;
    while (k < kenya.length || g < global.length) {
      for (let i = 0; i < 7 && k < kenya.length; i++) mixed.push(kenya[k++]);
      for (let i = 0; i < 3 && g < global.length; i++) mixed.push(global[g++]);
    }
    const items = mixed.slice(offset, offset + limit);

    return NextResponse.json({ success: true, data: items, meta: { count: items.length, limit, offset } });
  } catch (err) {
    console.error('GET /api/news error:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
