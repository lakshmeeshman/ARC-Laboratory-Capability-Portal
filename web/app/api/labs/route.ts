import { NextResponse } from 'next/server';
import { getLabs, getCountries, getCategories } from '@/lib/db';

export async function GET() {
  try {
    const labs = getLabs();
    const countries = getCountries();
    const categories = getCategories();

    return NextResponse.json({
      labs,
      countries,
      categories
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
