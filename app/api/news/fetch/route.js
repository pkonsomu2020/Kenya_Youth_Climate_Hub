import { NextResponse } from 'next/server';
import { runFetchJob } from '@/lib/jobs/fetchNews';

// Vercel cron sends GET — admin manual trigger sends POST
// Both are protected by ADMIN_SECRET_KEY in production

function isAuthorized(request) {
  const adminKey = request.headers.get('x-admin-key');
  // Vercel cron requests include a special header in production
  const isCron = request.headers.get('x-vercel-cron') === '1';
  if (process.env.NODE_ENV !== 'production') return true;
  return isCron || adminKey === process.env.ADMIN_SECRET_KEY;
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  runFetchJob().catch(console.error);
  return NextResponse.json({ success: true, message: 'News fetch job started' });
}

export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  runFetchJob().catch(console.error);
  return NextResponse.json({ success: true, message: 'News fetch job started' });
}
