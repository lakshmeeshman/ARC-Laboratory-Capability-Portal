import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { getCountryByName } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Globe2, Building2, Layers, ArrowLeft, Search, CheckCircle2 } from 'lucide-react';

export const revalidate = 0;

interface CountryPageProps {
  params: Promise<{ id: string }>;
}

export default async function CountryDetailPage({ params }: CountryPageProps) {
  const { id } = await params;
  const data = getCountryByName(id);

  if (!data || data.labs.length === 0) {
    notFound();
  }

  const { country, labs, categoryBreakdown, capabilities } = data;

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <Link
            href="/countries"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Country Directory</span>
          </Link>

          {/* Country Summary Header Card */}
          <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-teal-500 flex items-center justify-center text-slate-950 font-black shadow-md">
                  <Globe2 className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">{country}</h1>
                  <p className="text-xs text-teal-400 font-medium mt-0.5">
                    Regional Testing Hub &bull; {labs.length} Operating Lab Locations
                  </p>
                </div>
              </div>

              <Link
                href={`/?country=${encodeURIComponent(country)}`}
                className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>Search capabilities in {country}</span>
              </Link>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
              {categoryBreakdown.map((cat) => (
                <div
                  key={cat.category}
                  className="bg-slate-800 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-700 font-medium flex items-center gap-1.5"
                >
                  <span>{cat.category}</span>
                  <span className="bg-teal-500/20 text-teal-300 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-teal-500/30">
                    {cat.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Lab Locations in Country */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900">Operating Labs in {country}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {labs.map((lab) => (
                <Link
                  key={lab.lab_id}
                  href={`/labs/${lab.lab_id}`}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-teal-400 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-teal-600" />
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{lab.lab_name}</h3>
                      <span className="text-xs text-slate-500">{lab.city}, {lab.country}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border block mb-1 ${
                      lab.lab_type === 'Commercial Lab'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-purple-50 text-purple-700 border-purple-200'
                    }`}>
                      {lab.lab_type}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">{lab.capability_count} capabilities</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sample Capabilities Table */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900">Capability Overview for {country}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {capabilities.slice(0, 60).map((cap) => (
                <div key={cap.capability_id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <div className="font-bold text-slate-900">{cap.normalized_name}</div>
                  <div className="text-[11px] text-slate-500">{cap.lab_name} ({cap.lab_type})</div>
                  <div className="text-[10px] font-bold text-teal-700">{cap.category}</div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
