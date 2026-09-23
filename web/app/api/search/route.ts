import { NextRequest, NextResponse } from 'next/server';
import { searchCapabilities } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const country = searchParams.get('country') || 'all';
    const region = searchParams.get('region') || 'all';
    const labId = searchParams.get('labId') || 'all';
    const labType = searchParams.get('labType') || 'all';
    const category = searchParams.get('category') || 'all';
    const availability = searchParams.get('availability') || 'all';
    const limit = parseInt(searchParams.get('limit') || '300', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const result = searchCapabilities({
      query,
      country,
      region,
      labId,
      labType,
      category,
      availability,
      limit,
      offset
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Search error' }, { status: 500 });
  }
}
