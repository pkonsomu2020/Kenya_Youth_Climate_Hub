
import { NextResponse } from 'next/server';
import { getLibraryCounts } from '@/lib/services/libraryStorage';

export async function GET() {
  try {
    const counts = await getLibraryCounts();
    return NextResponse.json({ success: true, data: counts });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to fetch stats' }, { status: 500 });
  }
}
