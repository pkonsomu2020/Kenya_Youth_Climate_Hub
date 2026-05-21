
import { NextResponse } from 'next/server';
import { getEventCounts } from '@/lib/services/eventStorage';

export async function GET() {
  try {
    const counts = await getEventCounts();
    return NextResponse.json({ success: true, data: counts });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to fetch stats' }, { status: 500 });
  }
}
