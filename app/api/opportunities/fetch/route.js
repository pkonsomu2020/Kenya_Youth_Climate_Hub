import { NextResponse } from 'next/server';
import { runOpportunityJob } from '@/lib/jobs/fetchOpportunities';

function isAuthorized(request) {
  const adminKey = request.headers.get('x-admin-key');
  const isCron = request.headers.get('x-vercel-cron') === '1';
  if (process.env.NODE_ENV !== 'production') return true;
  return isCron || adminKey === process.env.ADMIN_SECRET_KEY;
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  runOpportunityJob().catch(console.error);
  return NextResponse.json({ success: true, message: 'Opportunities fetch job started' });
}

export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  runOpportunityJob().catch(console.error);
  return NextResponse.json({ success: true, message: 'Opportunities fetch job started' });
}
