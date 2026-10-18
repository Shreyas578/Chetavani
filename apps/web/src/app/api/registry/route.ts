import { NextResponse } from 'next/server';
import liveRegistryData from '@/lib/live-registry.json';

// In-memory reports store for serverless runtime (persists dynamic community reports)
// This bridges user-reported domains from the web app to the extension and bot in real-time
let dynamicReports: any[] = [];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const check = searchParams.get('check')?.trim().toLowerCase();

  // Combine static seeded on-chain registry with dynamically reported threats
  const allReports = [...dynamicReports, ...(liveRegistryData as any[])];

  if (check) {
    const matched = allReports.find(
      (r) => r.indicator.toLowerCase() === check || check.includes(r.indicator.toLowerCase())
    );
    return NextResponse.json({
      found: !!matched,
      report: matched || null,
      totalCount: allReports.length,
    });
  }

  return NextResponse.json({
    success: true,
    count: allReports.length,
    reports: allReports,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || !body.indicator) {
      return NextResponse.json({ error: 'Indicator required' }, { status: 400 });
    }

    const cleanIndicator = body.indicator.toLowerCase().trim();

    // Check if already in list
    const exists = dynamicReports.some((r) => r.indicator.toLowerCase() === cleanIndicator);
    if (!exists) {
      const newEntry = {
        key: `0x${Math.random().toString(16).slice(2).padStart(64, '0')}`,
        indicator: cleanIndicator,
        kind: body.kind || 'domain',
        category: body.category || 'other',
        lang: body.lang || 'en',
        status: 'unconfirmed',
        confirms: 0,
        payload: {
          title: body.title || 'Community Reported Scam',
          description: body.description || 'Reported via Chetavani Web App',
          sampleTemplate: body.sampleTemplate || '',
          createdAt: Date.now(),
        },
        expiresAtBlock: 154800,
      };

      dynamicReports = [newEntry, ...dynamicReports];
    }

    return NextResponse.json({ success: true, count: dynamicReports.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
