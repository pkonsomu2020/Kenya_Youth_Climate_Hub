
import { NextResponse } from 'next/server';
import { getOpportunityCounts } from '@/lib/services/opportunityStorage';

export async function GET() {
  try {
    const counts = await getOpportunityCounts();
    return NextResponse.json({ success: true, data: counts });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to fetch stats' }, { status: 500 });
  }
}
