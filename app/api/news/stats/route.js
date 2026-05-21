
import { NextResponse } from 'next/server';
import { getCategoryCounts } from '@/lib/services/newsStorage';

export async function GET() {
  try {
    const counts = await getCategoryCounts();
    return NextResponse.json({ success: true, data: counts });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to fetch stats' }, { status: 500 });
  }
}
