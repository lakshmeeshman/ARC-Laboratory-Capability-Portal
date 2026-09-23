import { NextResponse } from 'next/server';
import { getDataQualityReport } from '@/lib/db';

export async function GET() {
  try {
    const report = getDataQualityReport();
    return NextResponse.json(report);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
