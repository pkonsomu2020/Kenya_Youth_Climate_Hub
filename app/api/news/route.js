
import { NextResponse } from 'next/server';
import { getArticles } from '@/lib/services/newsStorage';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit')) || 20, 50);
    const category = searchParams.get('category') || searchParams.get('type') || 'All';
    const page = parseInt(searchParams.get('page')) || 1;
    const offset = parseInt(searchParams.get('offset')) || (page - 1) * limit;
    
    const items = await getArticles({ limit, category, type: category, format: searchParams.get('format') || 'All', offset });
    
    return NextResponse.json({ success: true, data: items, meta: { count: items.length, limit, offset } });
  } catch (err) {
    console.error('GET /api/news error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to fetch' }, { status: 500 });
  }
}
